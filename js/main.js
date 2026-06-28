/* =============================================================================
   COMPORTAMENTOS BASE
   - Header sticky com mudança ao rolar
   - Menu mobile
   - Link de navegação ativo conforme a seção visível
   - Ano no footer
   - Download de CV (com fallback amigável)
   ========================================================================== */
(function () {
  "use strict";

  function init() {
    initHeaderScroll();
    initMobileMenu();
    initActiveNav();
    initYear();
    initCvDownload();
  }

  /* ---------- Header muda ao rolar -------------------------------------- */
  function initHeaderScroll() {
    var header = document.getElementById("site-header");
    if (!header) return;
    var nav = header.querySelector("nav");
    function onScroll() {
      if (window.scrollY > 16) {
        nav.classList.add("shadow-soft", "!bg-surface/90");
      } else {
        nav.classList.remove("shadow-soft", "!bg-surface/90");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Menu mobile ----------------------------------------------- */
  function initMobileMenu() {
    var btn = document.getElementById("menu-btn");
    var menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;
    var icon = btn.querySelector("i");

    function open() {
      menu.classList.remove("hidden");
      // força reflow antes da transição
      void menu.offsetWidth;
      menu.classList.add("flex");
      menu.style.transform = "translateY(0)";
      btn.setAttribute("aria-expanded", "true");
      icon.className = "fa-solid fa-xmark text-base";
      document.body.style.overflow = "hidden";
    }
    function close() {
      menu.style.transform = "translateY(-100%)";
      btn.setAttribute("aria-expanded", "false");
      icon.className = "fa-solid fa-bars text-base";
      document.body.style.overflow = "";
      setTimeout(function () {
        menu.classList.add("hidden");
        menu.classList.remove("flex");
      }, 300);
    }
    function toggle() {
      if (menu.classList.contains("hidden")) open();
      else close();
    }

    btn.addEventListener("click", toggle);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.classList.contains("hidden")) close();
    });
  }

  /* ---------- Link ativo conforme seção --------------------------------- */
  function initActiveNav() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".js-nav a")
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      map[id] = link;
    });

    var sections = Object.keys(map)
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = map[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("is-active");
            });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* ---------- Ano ------------------------------------------------------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Download de CV ------------------------------------------- */
  function initCvDownload() {
    var btn = document.getElementById("cv-download");
    if (!btn) return;
    var CV_PATH = "cv/Antonio-Elias-CV.pdf";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      fetch(CV_PATH, { method: "HEAD" })
        .then(function (res) {
          if (res.ok) {
            var a = document.createElement("a");
            a.href = CV_PATH;
            a.download = "Antonio-Elias-CV.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
          } else {
            notify();
          }
        })
        .catch(notify);
    });
    function notify() {
      var msg = document.createElement("div");
      msg.className =
        "fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-fg px-4 py-2.5 text-sm text-bg shadow-soft";
      msg.textContent = "Currículo em PDF em breve! Use o formulário de contato.";
      document.body.appendChild(msg);
      setTimeout(function () {
        msg.remove();
      }, 3500);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
