# BookHub Frontend

Frontend React com Vite. O catálogo usa a Open Library diretamente; chamadas à API BookHub usam o endereço `http://localhost:3000` definido em `src/services/api.ts`.

## Requisitos

- Node.js 20.19+ ou 22.12+ e npm.
- Backend disponível em `http://localhost:3000` para os fluxos que usam a API.

## Instalação e scripts

Na pasta `frontend`:

```bash
npm ci
npm run dev
```

O Vite normalmente disponibiliza o site em `http://localhost:5173`.

```bash
npm run build
npm run preview
npm run lint
```

O proxy `/api` configurado em `vite.config.js` não é usado pelo cliente Axios atual, cuja URL base é `http://localhost:3000`. Não há `.env.example` no repositório.

## Organização

```text
src/                    Aplicação React
src/pages/              Telas da aplicação
src/services/           Serviços BookHub e Open Library
src/store/              Estado persistido no navegador
public/bookhub/         Páginas e recursos estáticos
vite.config.js          Configuração do Vite
```

Para os passos de uso, consulte o [manual](../docs/manual-usuario.md). Para o contrato dos endpoints, consulte [API](../docs/api.md).

## Limitações conhecidas

O arquivo `src/main.jsx` importa `./components/BookCard.example`, que não existe atualmente. Por isso, `npm run build` falha até que essa importação/componente seja corrigida.
