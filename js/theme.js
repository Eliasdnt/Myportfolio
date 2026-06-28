/* =============================================================================
   TEMA CLARO / ESCURO
   - O script anti-flash no <head> já aplica a classe `dark` antes do paint.
   - Aqui apenas tratamos o toggle e a persistência da escolha do usuário.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "theme";

  function isDark() {
    return root.classList.contains("dark");
  }

  function setTheme(dark) {
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch (e) {}
    // Atualiza a cor da barra do navegador (mobile)
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = dark ? "#0F172A" : "#F8FAFC";
  }

  function init() {
    // Garante o theme-color correto no load
    setTheme(isDark());

    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        setTheme(!isDark());
      });
    }

    // Se o usuário nunca escolheu manualmente, acompanha o SO em tempo real.
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var listener = function (e) {
        var stored;
        try {
          stored = localStorage.getItem(STORAGE_KEY);
        } catch (err) {}
        if (!stored) setTheme(e.matches);
      };
      if (mq.addEventListener) mq.addEventListener("change", listener);
      else if (mq.addListener) mq.addListener(listener);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
