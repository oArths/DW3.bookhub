# API do BookHub

Contrato extraído de `backend/server.js`, `backend/routes/*.js`, `backend/schemas/index.js` e `backend/services/livroConsulta.js`.

## Convenções

- Base local: `http://localhost:3000`.
- JSON: envie `Content-Type: application/json` quando houver corpo.
- Não há prefixo `/api`: os prefixos reais são `/usuarios`, `/livros`, `/reviews` e `/listas`.
- IDs internos são ObjectIds MongoDB com 24 caracteres hexadecimais.
- Falhas de validação Zod retornam `400` com `{ "erro": "...", "erros": [{ "campo": "...", "mensagem": "..." }] }`.
- Outros erros normalmente retornam JSON `{ "erro": "..." }`; alguns caminhos podem devolver mensagens específicas.

## Saúde

| Método | Caminho | Sucesso |
|---|---|---|
| `GET` | `/` | `200`, texto `API do BookHub está no ar!` |

## Usuários

### `POST /usuarios` — cadastrar

Corpo:

```json
{
  "username": "maria_leitora",
  "email": "maria@example.com",
  "password": "senha-segura",
  "nome": "Maria Silva",
  "bio": "Gosto de ficção."
}
```

`username` (3–30, sem espaços), `email` e `password` (8–72) são obrigatórios. `nome` é opcional (até 80) e `bio` é opcional/null (até 300). Retorna `201` com o documento do usuário, sem `passwordHash`; duplicidade de e-mail ou username retorna `409`.

### `POST /usuarios/login` — validar credenciais

Corpo: `{ "email": "maria@example.com", "password": "senha-segura" }`.

Retorna `201` com usuário sem `passwordHash` quando as credenciais conferem. Credenciais incorretas retornam `404`; validação do corpo retorna `400`. **Não emite JWT, token de sessão nem cookie.** A dependência `jsonwebtoken` não é usada no fluxo atual.

### Recuperação de senha

| Método e caminho | Corpo | Sucesso | Falhas documentadas no código |
|---|---|---|---|
| `POST /usuarios/forgot-password` | `{ "email": "maria@example.com" }` | `200` `{ "mensagem": "Código enviado para seu e-mail." }` | `400` validação; `404` e-mail inexistente; `429` cooldown de 60 s; `500` falha no envio |
| `POST /usuarios/verify-reset-code` | `{ "email": "maria@example.com", "code": "123456" }` | `200` `{ "mensagem": "Código válido." }` | `400` código inválido/expirado; `500` |
| `POST /usuarios/reset-password` | `{ "email": "maria@example.com", "code": "123456", "password": "nova-senha-segura" }` | `201` usuário sem `passwordHash` | `400` validação ou código inválido/expirado; `500` |

O código gerado tem seis dígitos e validade de uma hora. `code` é validado como string de 4–8 dígitos; senha nova segue 8–72 caracteres. O reset não emite uma sessão autenticada.

### `GET /usuarios/:id` — obter perfil

Retorna `200` com usuário sem `passwordHash`, `404` se não existir. O código atual não trata um ObjectId malformado separadamente; pode responder `500`.

### `PATCH /usuarios/:id` — atualizar perfil

Aceita ao menos um dos campos abaixo:

```json
{
  "nome": "Maria Silva",
  "username": "maria_leitora",
  "bio": "Leitora.",
  "avatarUrl": "https://example.com/avatar.png"
}
```

Retorna `200` com usuário sem `passwordHash`; `400` se nenhum campo válido for enviado; `404` se usuário não existir; `409` para username duplicado; `400` para ID inválido.

## Livros

### `GET /livros`

Lista livros persistidos no MongoDB, mais recentes primeiro.

### `GET /livros/busca?q={termo}&maxResults={n}`

Consulta a Penguin Random House, não a Open Library. `q` é obrigatório; `maxResults` é limitado pelo serviço a 1–40 e usa 20 por padrão. Retorna array com `titulo`, `autor`, `capaUrl`, `descricao`, `anoPublicacao` (quando disponível) e `generos`. Responde `400` sem termo e `502` para erro de configuração ou da fonte externa. Requer `PRH_USERNAME` e `PRH_PASSWORD`.

### `GET /livros/externo/:idExterno` e `GET /livros/:id`

Buscam respectivamente por identificador externo e `_id` MongoDB. Retornam `200`, `404` quando não há registro e, na rota por `_id`, `400` para ID inválido.

### `POST /livros` — criar ou atualizar referência externa

Corpo: `{ "idExterno": "OL123W", "titulo": "Título", "capaUrl": "https://..." }`. `idExterno` é obrigatório (até 120), `titulo` é obrigatório (até 300), `capaUrl` é opcional (até 500). Faz upsert por `idExterno` e retorna `200` com o livro. Campos `autor`, descrição, ano e gênero não são persistidos pelo esquema atual.

## Reviews

### `POST /reviews`

Corpo: `{ "usuarioId": "<ObjectId>", "livroId": "<ObjectId>", "nota": 5, "texto": "Ótima leitura." }`.

Nota é convertida para número e deve ser inteiro entre 0 e 5; comentário opcional de até 2.000 caracteres. Retorna `201` com documento criado. O backend não verifica autenticação nem a existência referencial dos IDs antes da gravação.

### `GET /reviews/usuario/:usuarioId` e `GET /reviews/livro/:livroId`

Retornam as reviews mais recentes primeiro. A rota por usuário popula `livroId` com `titulo`, `capaUrl` e `idExterno`; a rota por livro popula `usuarioId` com `username` e `avatarUrl`.

## Listas

### `POST /listas`

Corpo: `{ "usuarioId": "<ObjectId>", "nome": "Para ler", "descricao": "Opcional" }`. `nome` é obrigatório (1–100); descrição opcional/null (até 300). Retorna `201` com a lista.

### `GET /listas/usuario/:usuarioId`

Lista as listas do usuário, mais recentes primeiro.

### `POST /listas/:listaId/livros`

Corpo: `{ "usuarioId": "<ObjectId>", "livroId": "<ObjectId>", "statusLeitura": "quero_ler" }`. `statusLeitura` é opcional; valores: `quero_ler`, `lendo`, `lido`, `abandonado`. Retorna `201`. Erros: `400` entrada/ID inválido, `403` lista não pertence ao `usuarioId` enviado, `404` lista/livro não encontrado, `409` livro repetido na lista.

### `GET /listas/livros/usuario/:usuarioId`

Retorna todos os itens de lista do usuário, incluindo livro (`titulo`, `capaUrl`, `idExterno`) e lista (`nome`), mais recentes primeiro.

### `GET /listas/:listaId/livros?status={status}`

Lista itens com os dados do livro. O parâmetro `status` é opcional e deve ser um dos quatro valores aceitos; valor inválido retorna `400`.

### `PATCH /listas/:listaId/livros/:livroId`

Corpo: `{ "usuarioId": "<ObjectId>", "statusLeitura": "lendo" }`. Atualiza status, retornando o item atualizado. Pode responder `400`, `403`, `404` ou `500`.

### `DELETE /listas/:listaId/livros/:livroId?usuarioId={ObjectId}`

Remove o item da lista. `usuarioId` é obrigatório na query e é usado para verificar o dono informado. Sucesso: `204` sem corpo; outros resultados podem ser `400`, `403`, `404` ou `500`.

## Segurança e limitações do contrato

- `cors()` está aberto sem lista de origens no servidor atual.
- Não há middleware de autenticação/autorização. Rotas recebem IDs de usuário no corpo ou query e não os vinculam a uma identidade verificada. A verificação de dono de lista compara com o ID fornecido pelo próprio cliente.
- O frontend guarda o `_id` do usuário numa propriedade de estado chamada `token`, mas esse valor não é um token assinado e o backend não o valida.
- Não há endpoints de seguir/deixar de seguir, apesar do modelo `Segue`.
- O frontend usa Open Library diretamente para seu catálogo. Suas telas de coleção e formulário de review são demonstrações locais e não consomem os endpoints de listas/reviews.
- A documentação não promete JWT, OAuth, prefixo `/api`, sessão ou esquema SQL: nenhum deles corresponde ao backend atual.
