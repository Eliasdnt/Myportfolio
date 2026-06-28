/* =============================================================================
   FORMULÁRIO DE CONTATO
   - Validação client-side (nome, e-mail, telefone, mensagem)
   - Captura a origem do visitante (referrer/UTM) num campo oculto
   - Envio assíncrono via Web3Forms (não bloqueia a UI) com estado otimista
   - Persiste uma cópia da mensagem no localStorage (histórico / retry)
   ========================================================================== */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var submitBtn = document.getElementById("contact-submit");
  var result = document.getElementById("contact-result");
  var STORAGE_KEY = "contact:outbox";

  /* ---------- Origem do visitante (referrer + UTM) ---------------------- */
  function getOrigin() {
    var params = new URLSearchParams(window.location.search);
    var utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map(function (k) {
        var v = params.get(k);
        return v ? k + "=" + v : null;
      })
      .filter(Boolean)
      .join("&");
    var ref = document.referrer || "direto";
    return (utm ? "UTM[" + utm + "] " : "") + "ref=" + ref;
  }
  var originField = form.querySelector("[data-origin-field]");
  if (originField) originField.value = getOrigin();

  /* ---------- Validação ------------------------------------------------- */
  function showError(name, msg) {
    var el = form.querySelector('[data-error-for="' + name + '"]');
    var input = form.querySelector('[name="' + name + '"]');
    if (el) {
      el.textContent = msg || "";
      el.classList.toggle("hidden", !msg);
    }
    if (input) {
      input.classList.toggle("border-red-500", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    }
  }

  function validate() {
    var ok = true;
    var data = new FormData(form);
    var name = (data.get("name") || "").trim();
    var email = (data.get("email") || "").trim();
    var phone = (data.get("phone") || "").trim();
    var message = (data.get("message") || "").trim();

    if (name.length < 2) {
      showError("name", "Informe seu nome.");
      ok = false;
    } else showError("name", "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("email", "E-mail inválido.");
      ok = false;
    } else showError("email", "");

    // Telefone é opcional, mas se preenchido deve ter dígitos suficientes.
    if (phone && phone.replace(/\D/g, "").length < 8) {
      showError("phone", "Telefone incompleto.");
      ok = false;
    } else showError("phone", "");

    if (message.length < 10) {
      showError("message", "Escreva uma mensagem um pouco maior.");
      ok = false;
    } else showError("message", "");

    return ok;
  }

  // Valida em tempo real após a primeira tentativa
  var touched = false;
  form.addEventListener("input", function () {
    if (touched) validate();
  });

  /* ---------- Persistência local --------------------------------------- */
  function saveLocal(obj, status) {
    try {
      var box = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      box.unshift({
        name: obj.name,
        email: obj.email,
        interest: obj.interest,
        message: obj.message,
        at: new Date().toISOString(),
        status: status,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(box.slice(0, 20)));
    } catch (e) {}
  }

  /* ---------- Feedback -------------------------------------------------- */
  function setResult(type, msg) {
    if (!result) return;
    result.classList.remove("hidden");
    result.className =
      "rounded-xl px-4 py-3 text-sm " +
      (type === "success"
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : type === "error"
        ? "bg-red-500/10 text-red-600 dark:text-red-400"
        : "bg-surface-2 text-muted");
    result.textContent = msg;
  }
  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle("opacity-70", loading);
    submitBtn.querySelector("span").textContent = loading
      ? "Enviando…"
      : "Enviar mensagem";
  }

  /* ---------- Submit ---------------------------------------------------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    touched = true;

    // Honeypot: se preenchido, ignora silenciosamente (provável bot).
    if (form.querySelector('[name="botcheck"]') &&
        form.querySelector('[name="botcheck"]').checked) {
      return;
    }

    if (!validate()) {
      setResult("info", "Confira os campos destacados, por favor.");
      return;
    }

    var formData = new FormData(form);
    var object = Object.fromEntries(formData.entries());
    setLoading(true);
    setResult("info", "Enviando sua mensagem…");

    // Envio assíncrono — não trava a UI.
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(object),
    })
      .then(function (res) {
        return res.json().then(function (json) {
          return { ok: res.ok, json: json };
        });
      })
      .then(function (r) {
        if (r.ok) {
          saveLocal(object, "enviado");
          setResult(
            "success",
            "Mensagem enviada com sucesso! Obrigado — retornarei em breve. 🙌"
          );
          form.reset();
          if (originField) originField.value = getOrigin();
          touched = false;
        } else {
          saveLocal(object, "falhou");
          setResult(
            "error",
            (r.json && r.json.message) ||
              "Não foi possível enviar agora. Tente novamente em instantes."
          );
        }
      })
      .catch(function () {
        // Falha de rede: guarda localmente para o usuário não perder a mensagem.
        saveLocal(object, "pendente");
        setResult(
          "error",
          "Sem conexão no momento. Sua mensagem foi salva neste navegador — tente enviar novamente mais tarde."
        );
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();
