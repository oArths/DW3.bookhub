# Manual de utilização do BookHub

## 1. Requisitos e inicialização

- Node.js 20.19+ ou 22.12+ e npm.
- MongoDB acessível pela URI `MONGO_URI`.
- Credenciais de e-mail Resend para testar recuperação de senha.
- Credenciais Penguin Random House são necessárias somente para o endpoint de busca do backend. O catálogo do frontend usa a Open Library.

Na raiz do repositório, instale e inicie o backend:

```bash
cd backend
npm ci
```

Crie `backend/.env` com as configurações fornecidas para o ambiente:

```dotenv
MONGO_URI=<uri-do-mongodb>
PORT=3000
RESEND_API_KEY=<chave-resend>
RESEND_FROM_EMAIL=<remetente-verificado-no-resend>
PRH_USERNAME=<usuario-prh>
PRH_PASSWORD=<senha-prh>
```

`PORT` é opcional (padrão `3000`); `RESEND_FROM_EMAIL` é opcional e, quando omitida, o código usa `BookHub <onboarding@resend.dev>`. `PRH_USERNAME` e `PRH_PASSWORD` são necessários apenas para `GET /livros/busca`. Nunca publique valores reais do `.env`.

Inicie o servidor:

```bash
npm start
```

Em outro terminal, instale e inicie o frontend:

```bash
cd frontend
npm ci
npm run dev
```

Abra o endereço mostrado pelo Vite (normalmente `http://localhost:5173`). A API Express usa `http://localhost:3000`.

## 2. Navegação e uso

### Catálogo e busca

1. Abra `/` ou `/catalogo`.
2. Pesquise pelo título, autor ou assunto e selecione os filtros/ordenação disponíveis na tela.
3. Abra um resultado para ver seus detalhes em `/livros/:id`.

Os resultados e os detalhes vêm da Open Library diretamente pelo frontend. A busca do backend em `/livros/busca` é uma integração separada com a Penguin Random House; seus resultados não são automaticamente gravados no catálogo MongoDB.

### Criar conta e entrar

1. Em `/cadastro`, informe username, e-mail e senha e confirme o cadastro.
2. O username deve ter de 3 a 30 caracteres e não pode conter espaços. A senha deve ter de 8 a 72 caracteres.
3. Em `/login`, use o e-mail e a senha cadastrados.

O backend compara hashes de senha com bcryptjs e não devolve `passwordHash`. A interface mantém o usuário no armazenamento persistente do navegador e grava o `_id` do usuário num campo chamado `token`. Esse valor é apenas um identificador, não uma credencial. **Isso não equivale a uma sessão de servidor:** atualmente o backend não emite nem valida token de autenticação.

### Recuperar senha

1. Na tela de login, escolha “Esqueceu a senha?”.
2. Informe o e-mail cadastrado; o código de seis dígitos é enviado pelo Resend.
3. Digite o código recebido na tela de confirmação e defina uma nova senha.

O código expira em uma hora e há intervalo mínimo de um minuto para solicitar outro. A recuperação depende da configuração do Resend no backend.

### Minha coleção (demonstração local)

Em `/colecao`, é possível adicionar, editar, remover, filtrar e ordenar livros. Os dados ficam no `localStorage` do navegador (`bookhub.collection.v1`) e a tela começa com livros de exemplo. Limpar os dados do navegador remove as alterações. Essa coleção não é a mesma coisa que as listas persistidas pelo endpoint `/listas`.

### Detalhes e avaliações

Na página de detalhes, o formulário de avaliação valida uma nota e comentário, mas informa na própria interface que a avaliação é uma demonstração e não é salva no servidor. A API possui endpoints de reviews documentados em [API](api.md), mas o formulário ainda não os utiliza.

## 3. Ajuda e limitações

- Se a API não responder, confirme que o backend iniciou e conectou ao MongoDB; verifique a URI e a porta.
- Se a recuperação não enviar e-mail, confira `RESEND_API_KEY` e o remetente configurado.
- Se a busca do backend falhar, confira as credenciais `PRH_USERNAME` e `PRH_PASSWORD`; a busca do catálogo do frontend usa outro serviço.
- Rotas que alteram recursos recebem `usuarioId` do cliente, mas não há autenticação/autorização baseada numa identidade validada pelo servidor. Não use esses endpoints como proteção de dados em produção sem implementar autenticação.
- O recurso de seguir usuários tem um modelo de dados, mas ainda não possui rotas de API ou tela funcional.
