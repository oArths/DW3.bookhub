# BookHub — contrato de API (autenticação)

Frontend pronto em `login.html`, `cadastro.html` e `recuperar-senha.html`.  
Configure `js/auth-config.js` (`apiBaseUrl` e endpoints).

## POST `/api/auth/login`

**Request**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response 200**
```json
{
  "accessToken": "jwt...",
  "refreshToken": "jwt...",
  "user": {
    "id": "uuid",
    "name": "Maria",
    "email": "usuario@email.com"
  }
}
```

**Response 401**
```json
{ "message": "E-mail ou senha inválidos." }
```

---

## POST `/api/auth/register`

**Request**
```json
{
  "name": "Maria Silva",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response 201** — mesmo formato do login.

---

## POST `/api/auth/forgot-password`

**Request**
```json
{ "email": "usuario@email.com" }
```

**Response 200** — sempre genérico (não revelar se e-mail existe):
```json
{ "message": "Se o e-mail existir, enviaremos instruções." }
```

---

## POST `/api/auth/logout`

Header: `Authorization: Bearer {accessToken}`  
Cookie de sessão opcional (`credentials: "include"` no frontend).

---

## GET `/api/auth/oauth/instagram` e `/api/auth/oauth/facebook`

Redirecionamento OAuth iniciado pelo botão social. Após callback no backend, redirecionar para `AUTH_CONFIG.redirectAfterLogin` com token ou cookie.

---

## Banco de dados (sugestão)

Tabela `users`:
| Campo | Tipo |
|-------|------|
| id | UUID PK |
| name | VARCHAR(120) |
| email | VARCHAR(255) UNIQUE |
| password_hash | VARCHAR(255) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

Tabela `password_reset_tokens` (opcional):
| token | user_id | expires_at |

OAuth: tabela `oauth_accounts` (provider, provider_user_id, user_id).

---

## Segurança (backend)

- Hash de senha: bcrypt ou argon2 (nunca armazenar senha em texto).
- JWT com expiração curta + refresh token ou sessão httpOnly.
- Rate limit em login e forgot-password.
- CORS configurado para o domínio do frontend.
- HTTPS em produção.
