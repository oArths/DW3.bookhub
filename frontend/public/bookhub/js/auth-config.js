/**
 * Configuração de autenticação — ajuste quando o backend estiver no ar.
 * Em produção, prefira injetar AUTH_CONFIG via build ou variável de ambiente no servidor.
 */
window.AUTH_CONFIG = {
  /** URL base da API (ex.: https://api.bookhub.com.br ou http://localhost:3000) */
  apiBaseUrl: "/api",

  endpoints: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    me: "/auth/me",
    oauthInstagram: "/auth/oauth/instagram",
    oauthFacebook: "/auth/oauth/facebook",
  },

  /** Chave no localStorage para o access token (JWT ou session token) */
  tokenStorageKey: "bookhub_access_token",
  refreshTokenStorageKey: "bookhub_refresh_token",

  /** Redirecionamento após login bem-sucedido */
  redirectAfterLogin: "/dashboard.html",

  /** Páginas públicas de auth */
  loginPath: "/login.html",
  registerPath: "/cadastro.html",
};
