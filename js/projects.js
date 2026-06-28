/* =============================================================================
   PROJETOS
   - Renderiza os cards a partir de PORTFOLIO_CONFIG (projetos públicos +
     vitrine privada/trabalho).
   - Filtro: Todos / Públicos / Privados.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.PORTFOLIO_CONFIG || {};

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function placeholder(title) {
    var letter = (title || "?").trim().charAt(0).toUpperCase();
    return (
      '<div class="grid h-44 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/10">' +
      '<span class="font-display text-5xl font-bold text-accent/70">' +
      escapeHtml(letter) +
      "</span></div>"
    );
  }

  function mediaBlock(p) {
    if (!p.image) return placeholder(p.title);
    return (
      '<div class="relative h-44 overflow-hidden rounded-xl bg-surface-2">' +
      '<img src="' +
      escapeHtml(p.image) +
      '" alt="Prévia do projeto ' +
      escapeHtml(p.title) +
      '" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" ' +
      "onerror=\"this.parentElement.outerHTML='" +
      placeholder(p.title).replace(/'/g, "\\'") +
      "'\" />" +
      "</div>"
    );
  }

  function tagsBlock(tags) {
    if (!tags || !tags.length) return "";
    return (
      '<div class="mt-4 flex flex-wrap gap-1.5">' +
      tags
        .map(function (t) {
          return '<span class="chip">' + escapeHtml(t) + "</span>";
        })
        .join("") +
      "</div>"
    );
  }

  function linksBlock(p) {
    var html = '<div class="mt-5 flex items-center gap-3">';
    if (p.demo) {
      html +=
        '<a href="' +
        escapeHtml(p.demo) +
        '" target="_blank" rel="noopener" class="btn-primary !px-4 !py-2 text-xs">' +
        '<i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>';
    }
    if (p.type === "privado") {
      html +=
        '<span class="chip border-amber-400/40 text-amber-500"><i class="fa-solid fa-lock"></i> Código privado</span>';
    } else if (p.code) {
      html +=
        '<a href="' +
        escapeHtml(p.code) +
        '" target="_blank" rel="noopener" class="btn-outline !px-4 !py-2 text-xs">' +
        '<i class="fa-brands fa-github"></i> Código</a>';
    }
    html += "</div>";
    return html;
  }

  function card(p) {
    var badge =
      p.type === "privado"
        ? '<span class="absolute right-4 top-4 chip border-amber-400/40 bg-surface/90 text-amber-500"><i class="fa-solid fa-lock"></i> Privado</span>'
        : "";
    return (
      '<article class="group card card-hover reveal relative flex flex-col" data-type="' +
      escapeHtml(p.type || "publico") +
      '">' +
      badge +
      mediaBlock(p) +
      '<h3 class="mt-5 font-display text-lg font-semibold">' +
      escapeHtml(p.title) +
      "</h3>" +
      '<p class="mt-2 flex-1 text-sm leading-relaxed text-muted">' +
      escapeHtml(p.description) +
      "</p>" +
      tagsBlock(p.tags) +
      linksBlock(p) +
      "</article>"
    );
  }

  function render() {
    var grid = document.getElementById("projetos-grid");
    if (!grid) return;

    var list = []
      .concat(cfg.projects || [])
      .concat(cfg.privateShowcase || []);

    if (!list.length) {
      grid.innerHTML =
        '<p class="text-sm text-muted">Nenhum projeto cadastrado ainda.</p>';
      return;
    }

    grid.innerHTML = list
      .map(card)
      .join("");

    if (window.PortfolioAnim) window.PortfolioAnim.initReveal();
    initFilters(grid);
  }

  function initFilters(grid) {
    var wrap = document.querySelector(".js-project-filters");
    if (!wrap) return;
    var buttons = Array.prototype.slice.call(wrap.querySelectorAll("[data-filter]"));

    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      var filter = btn.getAttribute("data-filter");

      buttons.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });

      Array.prototype.slice.call(grid.children).forEach(function (cardEl) {
        var type = cardEl.getAttribute("data-type");
        var show = filter === "todos" || type === filter;
        cardEl.style.transition = "opacity .25s ease";
        if (show) {
          cardEl.style.display = "";
          requestAnimationFrame(function () {
            cardEl.style.opacity = "1";
          });
        } else {
          cardEl.style.opacity = "0";
          setTimeout(function () {
            cardEl.style.display = "none";
          }, 250);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
