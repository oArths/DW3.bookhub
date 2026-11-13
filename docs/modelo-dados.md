# Modelo de dados

## Banco e convenções

O backend usa MongoDB por meio do Mongoose; não há esquema SQL, migrações relacionais ou diagrama de tabelas. Cada modelo cria uma coleção MongoDB com o nome pluralizado pelo Mongoose. Os documentos têm `_id` do tipo `ObjectId`. Todos os modelos abaixo habilitam `timestamps`, gerando `createdAt` e `updatedAt`.

As regras de validação HTTP também ficam em `backend/schemas/index.js`. Elas complementam os esquemas Mongoose, mas não substituem as regras do banco: operações que não passam pelas rotas podem não receber as validações Zod.

## Coleções

### `usuarios` — modelo `Usuario`

| Campo | Tipo | Regras/default |
|---|---|---|
| `nome` | String | Default `""`; nome de exibição |
| `username` | String | Obrigatório, único |
| `email` | String | Obrigatório, único |
| `passwordHash` | String | Obrigatório; hash bcryptjs, nunca devolver em respostas |
| `bio` | String | Default `""` |
| `avatarUrl` | String | Default `""` |
| `resetPasswordCode` | String | Default `""`; código temporário usado na recuperação |
| `resetPasswordToken` | String | Default `""`; atualmente não usado pelo fluxo implementado |
| `resetPasswordExpires` | Date | Default declarado como `""`; preenchido com data de expiração no fluxo de recuperação |
| `resetPasswordSentAt` | Date | Default `null`; usado para intervalo entre envios |

O cadastro limita username a 3–30 caracteres sem espaços, e-mail a formato válido, senha a 8–72 caracteres, bio a 300 caracteres e nome a 80. Username e e-mail possuem índices únicos declarados via `unique: true`.

O código de recuperação é armazenado como string no documento (não há hash ou TTL configurado para ele); a validade é verificada pela rota usando `resetPasswordExpires`.

### `livros` — modelo `Livro`

| Campo | Tipo | Regras/default |
|---|---|---|
| `idExterno` | String | Obrigatório, único, `trim`; identificador da fonte externa |
| `titulo` | String | Obrigatório, `trim` |
| `capaUrl` | String | Default `""` |

A rota `POST /livros` aceita `idExterno` (máximo 120), `titulo` (máximo 300) e `capaUrl` (máximo 500). Ela faz upsert pelo `idExterno`.

### `reviews` — modelo `Review`

| Campo | Tipo | Regras/default |
|---|---|---|
| `usuarioId` | ObjectId | Obrigatório; referência a `Usuario` |
| `livroId` | ObjectId | Obrigatório; referência a `Livro` |
| `nota` | Number | Obrigatório; Mongoose permite de 0 a 5; a API exige inteiro |
| `texto` | String | Default `""` |

Índices: `{ usuarioId: 1, livroId: 1 }` e `{ livroId: 1, createdAt: -1 }`. O primeiro não é único; o modelo permite várias reviews do mesmo usuário para o mesmo livro.

### `listas` — modelo `Lista`

| Campo | Tipo | Regras/default |
|---|---|---|
| `usuarioId` | ObjectId | Obrigatório; referência a `Usuario` |
| `nome` | String | Obrigatório |
| `descricao` | String | Default `""` |
| `livroIds` | Array de ObjectId | Referências a `Livro`; default vazio |

As rotas atuais guardam a associação dos livros na coleção `listalivros`; `livroIds` existe no esquema, mas não é atualizado por essas rotas.

### `listalivros` — modelo `ListaLivro`

Cada documento representa um livro associado a uma lista.

| Campo | Tipo | Regras/default |
|---|---|---|
| `listaId` | ObjectId | Obrigatório; referência a `Lista` |
| `usuarioId` | ObjectId | Obrigatório; referência ao dono em `Usuario` |
| `livroId` | ObjectId | Obrigatório; referência a `Livro` |
| `statusLeitura` | String | Obrigatório; default `quero_ler` |
| `adicionadoEm` | Date | Obrigatório; default data atual |

Status aceitos: `quero_ler`, `lendo`, `lido`, `abandonado`. Índices: `{ listaId: 1, livroId: 1 }` único, impedindo duplicar um livro na mesma lista; `{ usuarioId: 1, statusLeitura: 1 }`.

### `segues` — modelo `Segue`

| Campo | Tipo | Regras/default |
|---|---|---|
| `seguidorId` | ObjectId | Obrigatório; referência a `Usuario` |
| `seguidoId` | ObjectId | Obrigatório; referência a `Usuario` |

Índice único composto `{ seguidorId: 1, seguidoId: 1 }`. O modelo não tem rotas ou interface de seguir/deixar de seguir no estado atual.

## Referências e limites

- `Review.usuarioId` → `Usuario`; `Review.livroId` → `Livro`.
- `Lista.usuarioId` → `Usuario`; `Lista.livroIds[]` → `Livro` (campo definido, mas não usado pelas rotas).
- `ListaLivro.listaId` → `Lista`; `ListaLivro.usuarioId` → `Usuario`; `ListaLivro.livroId` → `Livro`.
- `Segue.seguidorId` e `Segue.seguidoId` → `Usuario`.
- `ref` permite `populate()`; não cria integridade referencial automática como uma chave estrangeira SQL.
- Não há índice de expiração TTL para os códigos de recuperação nem índices adicionais além dos documentados.

Fonte da especificação: `backend/models/*.js` e `backend/schemas/index.js`.
