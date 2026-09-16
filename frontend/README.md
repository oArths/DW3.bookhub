# BookHub Front-end

Front-end do BookHub utilizando React, Vite e Tailwind CSS.

## Requisitos

- Node.js 18 ou superior
- npm
- Backend do BookHub disponível em `http://localhost:3000` para testar a integração

## Instalação

Na pasta `frontend`, instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

A variável `VITE_API_URL` define o endereço do backend usado pelo proxy de desenvolvimento:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts

Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O front-end ficará disponível em `http://localhost:5173`.

Gerar a versão de produção:

```bash
npm run build
```

Executar a pré-visualização do build:

```bash
npm run preview
```

Verificar o código com ESLint:

```bash
npm run lint
```

## Estrutura principal

```text
src/                    Aplicação React
public/bookhub/         Páginas estáticas e recursos de autenticação
public/bookhub/css/     Estilos das telas públicas
public/bookhub/js/      Configuração e comportamento de autenticação
vite.config.js          Configuração do Vite e proxy da API
```

O arquivo `.env` contém configurações locais e não deve ser enviado ao repositório. O arquivo `.env.example` é o modelo versionado para os demais ambientes.
