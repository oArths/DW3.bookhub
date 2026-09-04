# BookHub — Guia de Setup do Back-end

Este guia é para quem vai integrar o front-end (React) com essa API. Siga a ordem abaixo.

## 1. Pré-requisitos

- Ter o **Node.js** instalado (versão 18 ou superior). Para conferir, rode no terminal: `node -v`
- Ter um editor de código (recomendado: VS Code)

## 2. Pegar o código

Peça para quem está com o projeto (provavelmente eu) compartilhar a pasta do back-end com você — por exemplo, subindo num repositório do GitHub e te dando acesso, ou compactando a pasta e enviando por outro meio.

**Importante:** o arquivo `.env` (com a senha do banco) **não deve ser compartilhado pelo GitHub** — ele deve ser enviado separadamente, por uma mensagem privada, e nunca commitado. Se o projeto for para o GitHub, confirme que existe um arquivo `.gitignore` com a linha `.env` dentro dele.

## 3. Instalar as dependências

Dentro da pasta do projeto, no terminal, rode:

```
npm install
```

Isso lê o `package.json` e baixa automaticamente todos os pacotes usados (express, mongoose, cors, dotenv, bcryptjs).

## 4. Configurar a conexão com o banco

Crie um arquivo chamado exatamente `.env` na raiz do projeto (mesmo nível do `server.js`) com este conteúdo, usando os dados reais que quem está com o projeto vai te passar:

```
MONGO_URI=mongodb+srv://usuario:senha@endereco-do-cluster.mongodb.net/bookhub?appName=NomeDoApp
PORT=3000
```

## 5. Rodar o servidor

```
node server.js
```

Se aparecer `Conectado ao MongoDB com sucesso!` e `Servidor rodando em http://localhost:3000`, está tudo certo.

## 6. Testar antes de conectar o React

Antes de escrever qualquer código no front-end, use o **Thunder Client** (extensão do VS Code) ou o Postman para confirmar que as rotas respondem. Veja o arquivo `API-INTEGRACAO.md` para a lista completa de rotas, exemplos de corpo (body) de cada requisição, e um exemplo de código usando `fetch` no React.

## 7. Chamando a API a partir do React

- A URL base durante o desenvolvimento é `http://localhost:3000`
- O CORS já está liberado no back-end, então chamadas do React (rodando em outra porta, tipo `http://localhost:5173`) funcionam sem bloqueio
- Guarde essa URL base numa variável de ambiente do próprio React (ex: `VITE_API_URL`), para facilitar trocar o endereço quando o back-end for para produção

## Em caso de erro

| Erro | Causa provável |
|---|---|
| `ECONNREFUSED` ou "conexão recusada" no navegador | O back-end não está rodando — confirme com `node server.js` |
| `MODULE_NOT_FOUND` | Alguma pasta (`models`, `routes`, `config`) não está no lugar certo, ou faltou rodar `npm install` |
| `404 Not Found` numa rota | Confira se a URL e o método (GET/POST) estão corretos, comparando com o `API-INTEGRACAO.md` |
| CORS bloqueado no console do navegador | Confirme que `app.use(cors())` está no `server.js` e que o servidor foi reiniciado depois da mudança |
