(function () {
  "use strict";

  var cfg = window.AUTH_CONFIG;
  if (!cfg) {
    console.warn("[auth] AUTH_CONFIG não encontrado. Carregue auth-config.js antes de auth.js.");
    return;
  }

  function apiUrl(path) {
    var base = (cfg.apiBaseUrl || "").replace(/\/$/, "");
    var p = path.startsWith("/") ? path : "/" + path;
    return base + p;
  }

  function getToken() {
    try {
      return localStorage.getItem(cfg.tokenStorageKey);
    } catch {
      return null;
    }
  }

  function setTokens(accessToken, refreshToken) {
    try {
      if (accessToken) localStorage.setItem(cfg.tokenStorageKey, accessToken);
      if (refreshToken) localStorage.setItem(cfg.refreshTokenStorageKey, refreshToken);
    } catch (e) {
      console.error("[auth] Falha ao persistir tokens", e);
    }
  }

  function clearTokens() {
    try {
      localStorage.removeItem(cfg.tokenStorageKey);
      localStorage.removeItem(cfg.refreshTokenStorageKey);
    } catch {
      return;
    }
  }

  /**
   * POST /api/auth/login
   * Body esperado pelo backend: { email: string, password: string }
   * Resposta esperada: { accessToken, refreshToken?, user?: { id, name, email } }
   */
  async function login(email, password) {
    var res = await fetch(apiUrl(cfg.endpoints.login), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: email.trim().toLowerCase(), password: password }),
    });

    var data = await parseJsonSafe(res);

    if (!res.ok) {
      var message =
        (data && (data.message || data.error)) ||
        "Não foi possível entrar. Verifique e-mail e senha.";
      throw new AuthError(message, res.status, data);
    }

    if (data.accessToken) setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  /**
   * POST /api/auth/register
   * Body: { name, email, password }
   */
  async function register(payload) {
    var res = await fetch(apiUrl(cfg.endpoints.register), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    var data = await parseJsonSafe(res);

    if (!res.ok) {
      throw new AuthError(
        (data && (data.message || data.error)) || "Não foi possível criar a conta.",
        res.status,
        data
      );
    }

    if (data.accessToken) setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  /** Redireciona para OAuth no backend (Passport, NextAuth, etc.) */
  function startOAuth(provider) {
    var key = provider === "instagram" ? "oauthInstagram" : "oauthFacebook";
    var path = cfg.endpoints[key];
    if (!path) return;
    window.location.href = apiUrl(path);
  }

  async function parseJsonSafe(res) {
    var text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  function AuthError(message, status, payload) {
    this.name = "AuthError";
    this.message = message;
    this.status = status;
    this.payload = payload;
  }
  AuthError.prototype = Object.create(Error.prototype);

  function showFormMessage(form, message, type) {
    var el = form.querySelector("[data-auth-message]");
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
    el.classList.toggle("auth-message--error", type === "error");
    el.classList.toggle("auth-message--success", type === "success");
  }

  function setSubmitting(form, loading) {
    var btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    btn.disabled = loading;
    btn.setAttribute("aria-busy", loading ? "true" : "false");
    var label = btn.getAttribute("data-label") || btn.textContent;
    if (!btn.getAttribute("data-label")) btn.setAttribute("data-label", label);
    btn.textContent = loading ? "Entrando…" : label;
  }

  /** Login page */
  var loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      showFormMessage(loginForm, "", "");

      if (!loginForm.reportValidity()) return;

      var email = loginForm.email.value;
      var password = loginForm.password.value;

      setSubmitting(loginForm, true);
      try {
        await login(email, password);
        showFormMessage(loginForm, "Login realizado! Redirecionando…", "success");
        window.location.href = cfg.redirectAfterLogin || "/";
      } catch (err) {
        showFormMessage(
          loginForm,
          err.message || "Erro ao entrar. Tente novamente.",
          "error"
        );
      } finally {
        setSubmitting(loginForm, false);
      }
    });
  }

  /** Register page */
  var registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      showFormMessage(registerForm, "", "");

      if (!registerForm.reportValidity()) return;

      var password = registerForm.password.value;
      var confirm = registerForm.passwordConfirm.value;
      if (password !== confirm) {
        showFormMessage(registerForm, "As senhas não coincidem.", "error");
        return;
      }

      setSubmitting(registerForm, true);
      try {
        await register({
          name: registerForm.name.value.trim(),
          email: registerForm.email.value.trim().toLowerCase(),
          password: password,
        });
        showFormMessage(registerForm, "Conta criada! Redirecionando…", "success");
        window.location.href = cfg.redirectAfterLogin || "/";
      } catch (err) {
        showFormMessage(
          registerForm,
          err.message || "Erro ao cadastrar. Tente novamente.",
          "error"
        );
      } finally {
        setSubmitting(registerForm, false);
      }
    });
  }

  /** Toggle senha */
  document.querySelectorAll("[data-toggle-password]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("aria-controls");
      var input = id ? document.getElementById(id) : null;
      if (!input) return;
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
      btn.setAttribute("aria-pressed", show ? "true" : "false");
    });
  });

  /** OAuth buttons */
  document.querySelectorAll("[data-oauth]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      startOAuth(btn.getAttribute("data-oauth"));
    });
  });

  window.BookHubAuth = {
    login: login,
    register: register,
    logout: async function () {
      try {
        await fetch(apiUrl(cfg.endpoints.logout), {
          method: "POST",
          headers: {
            Authorization: getToken() ? "Bearer " + getToken() : "",
            Accept: "application/json",
          },
          credentials: "include",
        });
      } finally {
        clearTokens();
        window.location.href = cfg.loginPath || "/login.html";
      }
    },
    getToken: getToken,
    clearTokens: clearTokens,
    startOAuth: startOAuth,
  };
})();
