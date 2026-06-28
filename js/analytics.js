/* =============================================================================
   ANALYTICS + CONSENTIMENTO (LGPD - Lei nº 13.709/2018)
   - Opt-in: NADA é rastreado antes do consentimento explícito.
   - Banner + modal de preferências (Analytics / Localização aproximada).
   - GoatCounter (cookieless) para agregação real entre visitantes.
   - Engajamento por seção (tempo/visualização) + origem (referrer/UTM)
     guardados no localStorage. Geo aproximado via geo-IP (sem armazenar IP cru).
   - Escolhas salvas no localStorage e revogáveis a qualquer momento.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.PORTFOLIO_CONFIG || {};
  var GC_CODE = cfg.goatcounterCode || "";
  var CONSENT_KEY = "consent";
  var CONSENT_VERSION = 1;

  var gcQueue = [];
  var gcReady = false;

  /* ---------- Estado de consentimento ---------------------------------- */
  function getConsent() {
    try {
      var c = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
      if (c && c.version === CONSENT_VERSION) return c;
    } catch (e) {}
    return null;
  }
  function saveConsent(analytics, geo) {
    var c = {
      version: CONSENT_VERSION,
      analytics: !!analytics,
      geo: !!geo,
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
    } catch (e) {}
    return c;
  }

  /* ---------- GoatCounter ---------------------------------------------- */
  function loadGoatCounter() {
    if (!GC_CODE || gcReady || window.goatcounter) return;
    window.goatcounter = { no_onload: false }; // conta o pageview automaticamente
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute(
      "data-goatcounter",
      "https://" + GC_CODE + ".goatcounter.com/count"
    );
    s.onload = function () {
      gcReady = true;
      gcQueue.forEach(function (ev) {
        try {
          window.goatcounter.count(ev);
        } catch (e) {}
      });
      gcQueue = [];
    };
    document.head.appendChild(s);
  }
  function gcEvent(path, title) {
    var ev = { path: path, title: title || path, event: true };
    if (gcReady && window.goatcounter && window.goatcounter.count) {
      try {
        window.goatcounter.count(ev);
      } catch (e) {}
    } else {
      gcQueue.push(ev);
    }
  }

  /* ---------- Origem (referrer / UTM) ---------------------------------- */
  function captureOrigin() {
    var params = new URLSearchParams(location.search);
    var data = {
      referrer: document.referrer || "direto",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem("analytics:origin", JSON.stringify(data));
    } catch (e) {}
    if (data.utm_source) gcEvent("utm-" + data.utm_source, "Origem: " + data.utm_source);
  }

  /* ---------- Engajamento por seção ------------------------------------ */
  function trackEngagement() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("section[id]")
    );
    if (!sections.length || !("IntersectionObserver" in window)) return;

    var dwell = {};
    var enterTime = {};
    var seen = {};

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          if (entry.isIntersecting) {
            enterTime[id] = Date.now();
            if (!seen[id]) {
              seen[id] = true;
              gcEvent("secao-" + id, "Seção: " + id);
            }
          } else if (enterTime[id]) {
            dwell[id] = (dwell[id] || 0) + (Date.now() - enterTime[id]);
            enterTime[id] = 0;
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach(function (s) {
      obs.observe(s);
    });

    function flush() {
      Object.keys(enterTime).forEach(function (id) {
        if (enterTime[id]) {
          dwell[id] = (dwell[id] || 0) + (Date.now() - enterTime[id]);
          enterTime[id] = Date.now();
        }
      });
      var summary = {};
      Object.keys(dwell).forEach(function (id) {
        summary[id] = Math.round(dwell[id] / 1000); // segundos
      });
      try {
        localStorage.setItem(
          "analytics:engagement",
          JSON.stringify({ sections: summary, at: new Date().toISOString() })
        );
      } catch (e) {}
    }
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") flush();
    });
    window.addEventListener("pagehide", flush);
  }

  /* ---------- Geolocalização aproximada (geo-IP) ----------------------- */
  function captureGeo() {
    // Reaproveita por 24h para não repetir a chamada.
    try {
      var cached = JSON.parse(localStorage.getItem("analytics:geo") || "null");
      if (cached && Date.now() - new Date(cached.at).getTime() < 86400000) return;
    } catch (e) {}

    fetch("https://ipwho.is/?fields=country,country_code,region,city")
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (!d || d.success === false) return;
        var geo = {
          country: d.country || "",
          country_code: d.country_code || "",
          region: d.region || "",
          city: d.city || "",
          at: new Date().toISOString(),
        };
        try {
          localStorage.setItem("analytics:geo", JSON.stringify(geo));
        } catch (e) {}
        if (geo.country_code)
          gcEvent("pais-" + geo.country_code, "País: " + geo.country);
      })
      .catch(function () {});
  }

  /* ---------- Ativar/desativar conforme consentimento ------------------ */
  function applyConsent(c) {
    if (!c) return;
    if (c.analytics) {
      loadGoatCounter();
      captureOrigin();
      trackEngagement();
    }
    if (c.geo) captureGeo();
  }

  /* ---------- UI: banner + modal --------------------------------------- */
  var banner = document.getElementById("consent-banner");
  var modal = document.getElementById("privacy-modal");
  var prefAnalytics = document.getElementById("pref-analytics");
  var prefGeo = document.getElementById("pref-geo");

  function showBanner() {
    if (banner) banner.classList.remove("hidden");
  }
  function hideBanner() {
    if (banner) banner.classList.add("hidden");
  }
  function openModal() {
    if (!modal) return;
    var c = getConsent();
    if (prefAnalytics) prefAnalytics.checked = c ? c.analytics : true;
    if (prefGeo) prefGeo.checked = c ? c.geo : false;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  function bind(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  }

  function init() {
    // Botões do banner
    bind("consent-accept", function () {
      applyConsent(saveConsent(true, true));
      hideBanner();
    });
    bind("consent-reject", function () {
      saveConsent(false, false);
      hideBanner();
    });
    bind("consent-settings", openModal);
    bind("banner-privacy-link", openModal);

    // Botões do rodapé
    bind("open-privacy", openModal);
    bind("open-cookie-settings", openModal);

    // Botões do modal
    bind("privacy-save", function () {
      var c = saveConsent(
        prefAnalytics ? prefAnalytics.checked : false,
        prefGeo ? prefGeo.checked : false
      );
      applyConsent(c);
      closeModal();
      hideBanner();
    });
    bind("privacy-reject", function () {
      saveConsent(false, false);
      // limpa dados já coletados nesta sessão
      ["analytics:origin", "analytics:engagement", "analytics:geo"].forEach(
        function (k) {
          try {
            localStorage.removeItem(k);
          } catch (e) {}
        }
      );
      closeModal();
      hideBanner();
    });

    Array.prototype.slice
      .call(document.querySelectorAll("[data-privacy-close]"))
      .forEach(function (el) {
        el.addEventListener("click", closeModal);
      });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });

    // Estado inicial
    var consent = getConsent();
    if (consent) {
      applyConsent(consent);
    } else {
      // pequeno atraso para não competir com o carregamento inicial
      setTimeout(showBanner, 800);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
