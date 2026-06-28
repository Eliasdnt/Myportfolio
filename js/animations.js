/* =============================================================================
   ANIMAÇÕES (sutis e profissionais)
   - Reveal no scroll (.reveal -> .is-visible) com stagger
   - Efeito de digitação no hero ([data-typed])
   - Contadores animados ([data-counter])
   - Botões "magnéticos" ([data-magnetic])
   Tudo respeita prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Reveal no scroll ------------------------------------------- */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // stagger entre irmãos do mesmo container
            var siblings = Array.prototype.slice.call(
              el.parentElement ? el.parentElement.children : []
            );
            var idx = siblings.indexOf(el);
            el.style.transitionDelay = Math.min(idx, 6) * 80 + "ms";
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Efeito de digitação --------------------------------------- */
  function initTyped() {
    var el = document.querySelector("[data-typed]");
    if (!el) return;

    var items = (el.getAttribute("data-typed-items") || "")
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    if (!items.length) return;

    if (reduceMotion) {
      el.textContent = items[0];
      return;
    }

    var i = 0,
      char = 0,
      deleting = false;

    function tick() {
      var word = items[i];
      if (deleting) {
        char--;
      } else {
        char++;
      }
      el.textContent = word.slice(0, char);

      var delay = deleting ? 45 : 95;
      if (!deleting && char === word.length) {
        delay = 1400; // pausa no fim da palavra
        deleting = true;
      } else if (deleting && char === 0) {
        deleting = false;
        i = (i + 1) % items.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    }
    tick();
  }

  /* ---------- Contadores animados --------------------------------------- */
  function initCounters() {
    var counters = Array.prototype.slice.call(
      document.querySelectorAll("[data-counter]")
    );
    if (!counters.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute("data-counter"), 10) || 0;
      if (reduceMotion) {
        el.textContent = String(target);
        return;
      }
      var start = 0,
        duration = 1200,
        startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = String(Math.round(start + (target - start) * eased));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) {
      obs.observe(c);
    });
  }

  /* ---------- Botões magnéticos ----------------------------------------- */
  function initMagnetic() {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    var els = Array.prototype.slice.call(
      document.querySelectorAll("[data-magnetic]")
    );
    els.forEach(function (el) {
      var strength = 18;
      el.style.transition = "transform 0.2s cubic-bezier(0.16,1,0.3,1)";
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform =
          "translate(" +
          (x / rect.width) * strength +
          "px," +
          (y / rect.height) * strength +
          "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* Exposto para que módulos que injetam conteúdo (github/projects) possam
     reanimar elementos novos. */
  window.PortfolioAnim = { initReveal: initReveal };

  function init() {
    initReveal();
    initTyped();
    initCounters();
    initMagnetic();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
