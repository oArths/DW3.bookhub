# BookHub — Guia de Integração com a API (Back-end)

## Informações gerais

- **URL base (desenvolvimento local):** `http://localhost:3000`
- **Formato:** todas as rotas recebem e devolvem JSON
- Antes de testar, o back-end precisa estar rodando com `node server.js`
- CORS já está liberado, então o front-end em React pode chamar essas rotas sem bloqueio do navegador

---

## Usuários

### Cadastrar usuário
`POST /usuarios`

**Corpo da requisição:**
```json
  {
    "username": "maria_leitora",
    "email": "maria@email.com",
    "password": "minhasenha123",
    "bio": "opcional"
  }
```

**Resposta (201 Created):**
```json
{
  "_id": "66f1a2b3c4d5e6f7g8h9i0j1",
  "username": "maria_leitora",
  "email": "maria@email.com",
  "bio": "",
  "avatarUrl": "",
  "createdAt": "2026-09-04T14:58:10.836Z"
}
```
A senha nunca é devolvida pela API, mesmo criptografada.

**Erros possíveis:** `400` (campo obrigatório faltando), `409` (username ou email já cadastrado).

### Buscar usuário por ID
`GET /usuarios/:id`

---

## Livros

### Listar todos os livros
`GET /livros`

### Buscar um livro específico
`GET /livros/:id`

### Cadastrar um livro
`POST /livros`

**Corpo da requisição:**
```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "anoPublicacao": 1899,
  "descricao": "opcional",
  "capaUrl": "opcional",
  "generos": ["Romance", "Clássico"]
}
```

---

## Reviews (avaliações)

### Criar uma review
`POST /reviews`

**Corpo da requisição:**
```json
{
  "usuarioId": "id do usuário que está avaliando",
  "livroId": "id do livro avaliado",
  "nota": 5,
  "texto": "opcional"
}
```
`nota` deve ser um número entre 0 e 5.

### Listar reviews de um livro
`GET /reviews/livro/:livroId`

Essa rota já retorna, dentro de cada review, os dados básicos de quem escreveu (`username` e `avatarUrl`), sem precisar de uma segunda chamada.

---

## Exemplo de chamada no React (fetch)

```javascript
async function cadastrarUsuario(dados) {
  const resposta = await fetch('http://localhost:3000/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.erro);
  }

  return resposta.json();
}
```

## Rotas ainda não implementadas (próximos passos)

- Login (autenticação com token)
- Listas de livros (`/listas`)
- Seguir/deixar de seguir usuários (`/segue`)
