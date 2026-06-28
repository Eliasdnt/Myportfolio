/* =============================================================================
   INTEGRAÇÃO COM O GITHUB (estática, sem backend)
   - Busca repositórios, eventos (commits) e perfil na API pública.
   - Faz cache no localStorage (TTL ~8h) para não estourar o limite de 60 req/h
     e para carregar instantâneo em visitas repetidas.
   - Conta de trabalho (work): SÓ aparece via repositórios pré-selecionados na
     config (featuredRepos). Commits do trabalho são filtrados para esses repos.
   - Abas: Destaques · Commits · Linguagens.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.github) || {};
  var PRIMARY = cfg.primary || "Eliasdnt";
  var WORK = cfg.work || null;
  var FEATURED = cfg.featuredRepos || [];
  var MAX_COMMITS = cfg.maxCommits || 12;
  var API = "https://api.github.com";
  var TTL = 8 * 60 * 60 * 1000; // 8h
  var loaded = false;

  /* ---------- Cache ----------------------------------------------------- */
  function cacheGet(key, allowStale) {
    try {
      var raw = localStorage.getItem("gh:" + key);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (allowStale) return obj.data;
      if (Date.now() - obj.t < TTL) return obj.data;
      return null;
    } catch (e) {
      return null;
    }
  }
  function cacheSet(key, data) {
    try {
      localStorage.setItem(
        "gh:" + key,
        JSON.stringify({ t: Date.now(), data: data })
      );
    } catch (e) {}
  }

  // fetch com cache; resolve com {data, stale, error}
  function getJSON(key, url) {
    var fresh = cacheGet(key, false);
    if (fresh) return Promise.resolve({ data: fresh, stale: false });

    return fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (res) {
        if (!res.ok) {
          var err = new Error("HTTP " + res.status);
          err.status = res.status;
          throw err;
        }
        return res.json();
      })
      .then(function (data) {
        cacheSet(key, data);
        return { data: data, stale: false };
      })
      .catch(function (err) {
        var stale = cacheGet(key, true);
        return { data: stale || null, stale: true, error: err };
      });
  }

  /* ---------- Util ------------------------------------------------------ */
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function timeAgo(iso) {
    var d = new Date(iso);
    var s = Math.floor((Date.now() - d.getTime()) / 1000);
    var t = [
      [31536000, "ano", "anos"],
      [2592000, "mês", "meses"],
      [86400, "dia", "dias"],
      [3600, "hora", "horas"],
      [60, "min", "min"],
    ];
    for (var i = 0; i < t.length; i++) {
      var n = Math.floor(s / t[i][0]);
      if (n >= 1) return "há " + n + " " + (n > 1 ? t[i][2] : t[i][1]);
    }
    return "agora há pouco";
  }

  var LANG_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    PHP: "#4F5D95",
    Shell: "#89e051",
    Vue: "#41b883",
    SCSS: "#c6538c",
  };
  function langColor(l) {
    return LANG_COLORS[l] || "rgb(var(--color-accent))";
  }

  /* ---------- Render: stats -------------------------------------------- */
  function renderStats(s) {
    function set(name, val) {
      var el = document.querySelector('[data-gh-stat="' + name + '"]');
      if (el) el.textContent = val;
    }
    set("repos", s.repos);
    set("stars", s.stars);
    set("followers", s.followers);
    set("commits", s.commits);
  }

  /* ---------- Render: destaques (repos) -------------------------------- */
  function repoCard(repo, isWork) {
    var lang = repo.language
      ? '<span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full" style="background:' +
        langColor(repo.language) +
        '"></span>' +
        esc(repo.language) +
        "</span>"
      : "";
    var badge = isWork
      ? '<span class="chip"><i class="fa-solid fa-briefcase"></i> Trabalho</span>'
      : "";
    return (
      '<a href="' +
      esc(repo.html_url) +
      '" target="_blank" rel="noopener" class="card card-hover reveal flex flex-col">' +
      '<div class="flex items-center justify-between gap-2">' +
      '<span class="flex items-center gap-2 font-display font-semibold"><i class="fa-solid fa-book-bookmark text-accent"></i>' +
      esc(repo.name) +
      "</span>" +
      badge +
      "</div>" +
      '<p class="mt-2 flex-1 text-sm text-muted">' +
      esc(repo.description || "Sem descrição.") +
      "</p>" +
      '<div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">' +
      lang +
      '<span class="inline-flex items-center gap-1"><i class="fa-regular fa-star"></i>' +
      (repo.stargazers_count || 0) +
      "</span>" +
      '<span class="inline-flex items-center gap-1"><i class="fa-solid fa-code-fork"></i>' +
      (repo.forks_count || 0) +
      "</span>" +
      '<span class="ml-auto">' +
      timeAgo(repo.updated_at) +
      "</span>" +
      "</div></a>"
    );
  }

  function renderDestaques(repos) {
    var panel = $('[data-panel="destaques"]');
    if (!panel) return;
    if (!repos.length) {
      panel.innerHTML =
        '<p class="text-sm text-muted">Não foi possível carregar os repositórios agora.</p>';
      return;
    }
    panel.innerHTML = repos
      .map(function (r) {
        return repoCard(r.repo, r.isWork);
      })
      .join("");
    if (window.PortfolioAnim) window.PortfolioAnim.initReveal();
  }

  /* ---------- Render: commits ------------------------------------------ */
  function renderCommits(commits) {
    var panel = $('[data-panel="commits"]');
    if (!panel) return;
    if (!commits.length) {
      panel.innerHTML =
        '<p class="text-sm text-muted">Nenhum commit público recente encontrado.</p>';
      return;
    }
    panel.innerHTML = commits
      .map(function (c) {
        return (
          '<a href="' +
          esc(c.url) +
          '" target="_blank" rel="noopener" class="reveal flex items-start gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/50">' +
          '<span class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent"><i class="fa-solid fa-code-commit"></i></span>' +
          '<span class="min-w-0 flex-1">' +
          '<span class="block truncate font-medium">' +
          esc(c.message.split("\n")[0]) +
          "</span>" +
          '<span class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">' +
          '<span class="inline-flex items-center gap-1"><i class="fa-solid fa-book"></i>' +
          esc(c.repo) +
          "</span>" +
          "<span>" +
          timeAgo(c.date) +
          "</span>" +
          "</span></span>" +
          '<i class="fa-solid fa-arrow-up-right-from-square mt-1 text-xs text-muted"></i>' +
          "</a>"
        );
      })
      .join("");
    if (window.PortfolioAnim) window.PortfolioAnim.initReveal();
  }

  /* ---------- Render: linguagens --------------------------------------- */
  function renderLanguages(repos) {
    var panel = $('[data-panel="linguagens"]');
    if (!panel) return;
    var counts = {};
    repos.forEach(function (r) {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    var entries = Object.keys(counts)
      .map(function (k) {
        return { name: k, n: counts[k] };
      })
      .sort(function (a, b) {
        return b.n - a.n;
      })
      .slice(0, 8);

    if (!entries.length) {
      panel.innerHTML =
        '<p class="text-sm text-muted">Sem dados de linguagem disponíveis.</p>';
      return;
    }
    var total = entries.reduce(function (s, e) {
      return s + e.n;
    }, 0);

    panel.innerHTML =
      '<div class="card reveal space-y-4">' +
      entries
        .map(function (e) {
          var pct = Math.round((e.n / total) * 100);
          return (
            '<div>' +
            '<div class="mb-1 flex items-center justify-between text-sm">' +
            '<span class="inline-flex items-center gap-2 font-medium"><span class="h-3 w-3 rounded-full" style="background:' +
            langColor(e.name) +
            '"></span>' +
            esc(e.name) +
            "</span>" +
            '<span class="text-muted">' +
            pct +
            "%</span></div>" +
            '<div class="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">' +
            '<div class="h-full rounded-full transition-all duration-700" style="width:' +
            pct +
            "%;background:" +
            langColor(e.name) +
            '"></div></div></div>'
          );
        })
        .join("") +
      "</div>";
    if (window.PortfolioAnim) window.PortfolioAnim.initReveal();
  }

  /* ---------- Tabs ------------------------------------------------------ */
  function initTabs() {
    var tabsWrap = $(".js-gh-tabs");
    if (!tabsWrap) return;
    var buttons = Array.prototype.slice.call(
      tabsWrap.querySelectorAll("[data-tab]")
    );
    tabsWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-tab]");
      if (!btn) return;
      var tab = btn.getAttribute("data-tab");
      buttons.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      document.querySelectorAll("[data-panel]").forEach(function (p) {
        p.classList.toggle("hidden", p.getAttribute("data-panel") !== tab);
      });
    });
  }

  /* ---------- Orquestração --------------------------------------------- */
  function loadAll() {
    if (loaded) return;
    loaded = true;

    var workFeatured = FEATURED.filter(function (f) {
      return f.account === "work";
    }).map(function (f) {
      return f.name;
    });
    var primaryFeatured = FEATURED.filter(function (f) {
      return f.account === "primary";
    }).map(function (f) {
      return f.name;
    });

    var tasks = [
      getJSON("user:" + PRIMARY, API + "/users/" + PRIMARY),
      getJSON(
        "repos:" + PRIMARY,
        API + "/users/" + PRIMARY + "/repos?per_page=100&sort=updated"
      ),
      getJSON(
        "events:" + PRIMARY,
        API + "/users/" + PRIMARY + "/events/public?per_page=100"
      ),
    ];
    // Eventos do trabalho só se houver repos pré-selecionados.
    if (WORK && workFeatured.length) {
      tasks.push(
        getJSON(
          "events:" + WORK,
          API + "/users/" + WORK + "/events/public?per_page=100"
        )
      );
    }
    // Repos pré-selecionados do trabalho (buscados individualmente).
    var workRepoTasks = (WORK ? workFeatured : []).map(function (name) {
      return getJSON("repo:" + WORK + "/" + name, API + "/repos/" + WORK + "/" + name);
    });

    Promise.all(tasks.concat(workRepoTasks)).then(function (results) {
      var user = results[0].data;
      var primaryRepos = Array.isArray(results[1].data) ? results[1].data : [];
      var primaryEvents = Array.isArray(results[2].data) ? results[2].data : [];
      var idx = 3;
      var workEvents = [];
      if (WORK && workFeatured.length) {
        workEvents = Array.isArray(results[idx].data) ? results[idx].data : [];
        idx++;
      }
      var workRepos = results
        .slice(idx)
        .map(function (r) {
          return r.data;
        })
        .filter(function (d) {
          return d && d.name;
        });

      /* ----- Destaques ----- */
      var featuredCards = [];
      primaryFeatured.forEach(function (name) {
        var repo = primaryRepos.find(function (r) {
          return r.name.toLowerCase() === name.toLowerCase();
        });
        if (repo) featuredCards.push({ repo: repo, isWork: false });
      });
      workRepos.forEach(function (repo) {
        featuredCards.push({ repo: repo, isWork: true });
      });
      // Fallback: se nada curado resolveu, mostra os mais estrelados.
      if (!featuredCards.length) {
        featuredCards = primaryRepos
          .filter(function (r) {
            return !r.fork;
          })
          .sort(function (a, b) {
            return b.stargazers_count - a.stargazers_count;
          })
          .slice(0, 6)
          .map(function (r) {
            return { repo: r, isWork: false };
          });
      }
      renderDestaques(featuredCards);

      /* ----- Commits ----- */
      var commits = [];
      function collectPush(events, allowRepos) {
        events.forEach(function (ev) {
          if (ev.type !== "PushEvent" || !ev.payload || !ev.payload.commits)
            return;
          var repoFull = ev.repo.name; // "user/repo"
          var repoName = repoFull.split("/")[1];
          if (allowRepos && allowRepos.indexOf(repoName) === -1) return;
          ev.payload.commits.forEach(function (c) {
            commits.push({
              message: c.message,
              repo: repoName,
              date: ev.created_at,
              url: "https://github.com/" + repoFull + "/commit/" + c.sha,
            });
          });
        });
      }
      collectPush(primaryEvents, null);
      if (workEvents.length) collectPush(workEvents, workFeatured);
      commits.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      commits = commits.slice(0, MAX_COMMITS);
      renderCommits(commits);

      /* ----- Linguagens ----- */
      renderLanguages(primaryRepos);

      /* ----- Stats ----- */
      var stars = primaryRepos.reduce(function (s, r) {
        return s + (r.stargazers_count || 0);
      }, 0);
      renderStats({
        repos: user ? user.public_repos : primaryRepos.length,
        stars: stars,
        followers: user ? user.followers : "—",
        commits: commits.length,
      });

      // Aviso discreto se usou dados em cache antigos por falha/limite
      if (results[1].error || results[2].error) {
        var panel = $('[data-panel="destaques"]');
        if (panel && !featuredCards.length) {
          panel.innerHTML =
            '<p class="text-sm text-muted">Limite da API do GitHub atingido. Tente novamente em alguns minutos.</p>';
        }
      }
    });
  }

  function init() {
    initTabs();
    var section = document.getElementById("github");
    if (!section || !("IntersectionObserver" in window)) {
      loadAll();
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            loadAll();
            obs.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );
    obs.observe(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
