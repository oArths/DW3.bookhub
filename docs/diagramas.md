# Diagramas do BookHub

Os diagramas abaixo descrevem os componentes e os modelos atualmente implementados; relações sem endpoint funcional estão indicadas.

## Arquitetura e integrações

```mermaid
flowchart LR
  Browser[Pessoa usuária / navegador]
  Frontend[React + Vite]
  API[Express API :3000]
  Mongo[(MongoDB)]
  OpenLibrary[Open Library]
  PRH[Penguin Random House]
  Resend[Resend]

  Browser --> Frontend
  Frontend -->|REST JSON: usuários, perfil| API
  Frontend -->|REST JSON: serviços configurados| API
  Frontend -->|HTTPS: catálogo e detalhes| OpenLibrary
  Frontend -.->|coleção de demonstração| LocalStorage[(localStorage)]
  Frontend -.->|avaliação de demonstração| DemoReview[Estado da tela]
  API --> Mongo
  API -->|busca /livros/busca| PRH
  API -->|código de recuperação| Resend
```

Observação: embora existam rotas de reviews e listas, a coleção e o formulário de review exibidos no frontend ainda não as utilizam.

## Modelo de dados (ER)

```mermaid
erDiagram
  USUARIO {
    ObjectId _id
    string nome
    string username UK
    string email UK
    string passwordHash
    string bio
    string avatarUrl
    string resetPasswordCode
    date resetPasswordExpires
    date resetPasswordSentAt
    date createdAt
    date updatedAt
  }
  LIVRO {
    ObjectId _id
    string idExterno UK
    string titulo
    string capaUrl
    date createdAt
    date updatedAt
  }
  LISTA {
    ObjectId _id
    ObjectId usuarioId FK
    string nome
    string descricao
    ObjectId[] livroIds
    date createdAt
    date updatedAt
  }
  LISTA_LIVRO {
    ObjectId _id
    ObjectId listaId FK
    ObjectId usuarioId FK
    ObjectId livroId FK
    string statusLeitura
    date adicionadoEm
    date createdAt
    date updatedAt
  }
  REVIEW {
    ObjectId _id
    ObjectId usuarioId FK
    ObjectId livroId FK
    number nota
    string texto
    date createdAt
    date updatedAt
  }
  SEGUE {
    ObjectId _id
    ObjectId seguidorId FK
    ObjectId seguidoId FK
    date createdAt
    date updatedAt
  }

  USUARIO ||--o{ LISTA : possui
  LISTA ||--o{ LISTA_LIVRO : contem
  LIVRO ||--o{ LISTA_LIVRO : aparece_em
  USUARIO ||--o{ LISTA_LIVRO : dono
  USUARIO ||--o{ REVIEW : escreve
  LIVRO ||--o{ REVIEW : recebe
  USUARIO ||--o{ SEGUE : seguidor
  USUARIO ||--o{ SEGUE : seguido
  LISTA }o--o{ LIVRO : livroIds_nao_usado_pelas_rotas
```

As referências são ObjectIds do MongoDB; o Mongoose `ref` dá suporte a `populate()`, mas não é uma chave estrangeira com integridade relacional automática. O campo `LISTA.livroIds` está no schema, enquanto as rotas persistem a relação em `LISTA_LIVRO`.

## Fluxo de recuperação de senha

```mermaid
sequenceDiagram
  actor Pessoa
  participant UI as Frontend React
  participant API as Express /usuarios
  participant DB as MongoDB
  participant Mail as Resend

  Pessoa->>UI: Informa e-mail
  UI->>API: POST /usuarios/forgot-password
  API->>DB: Busca usuário e verifica cooldown
  API->>DB: Salva código e validade de 1 hora
  API->>Mail: Envia código
  Mail-->>Pessoa: E-mail com código
  Pessoa->>UI: Informa código
  UI->>API: POST /usuarios/verify-reset-code
  API->>DB: Confere código e validade
  API-->>UI: Código válido
  Pessoa->>UI: Define nova senha
  UI->>API: POST /usuarios/reset-password
  API->>DB: Salva hash bcrypt e limpa código
  API-->>UI: Usuário sem passwordHash
```

## Fluxos disponíveis e suas persistências

```mermaid
flowchart TD
  A[Entrar no catálogo] --> B[Buscar / abrir livro]
  B --> C[Open Library]
  B --> D{Ação}
  D -->|Adicionar ou editar item| E[Minha coleção]
  E --> F[(localStorage do navegador)]
  D -->|Enviar review| G[Formulário demonstrativo]
  G --> H[Estado da tela; não persiste]
  I[Consumidor da API] --> J[POST /reviews ou /listas]
  J --> K[(MongoDB)]
```
