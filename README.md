# BookHub

Aplicação para descobrir livros, organizar uma coleção de leitura e avaliar obras.

## Documentação

- [Manual de utilização](docs/manual-usuario.md)
- [Especificação da API](docs/api.md)
- [Modelo de dados do MongoDB](docs/modelo-dados.md)
- [Diagramas](docs/diagramas.md)
- [Setup do backend](backend/Orientações/SETUP-BACKEND.md)

## Tecnologias

- Frontend: React, Vite e TypeScript/JavaScript
- Backend: Node.js, Express e Mongoose
- Banco de dados: MongoDB
- Integrações de livros: Open Library (frontend) e Penguin Random House (endpoint do backend)
- Envio de e-mail: Resend

## Estado das funcionalidades

O catálogo e a busca visual usam a Open Library diretamente pelo frontend. A API Express também oferece uma busca independente na Penguin Random House. A coleção da rota `/colecao` e o formulário de avaliação na tela do livro são demonstrações locais: não gravam no MongoDB. As rotas de listas e reviews descritas na API persistem dados no backend, mas ainda não estão conectadas a essas demonstrações do frontend.

O projeto não implementa autenticação por token no backend. O login valida e retorna o usuário, mas não emite JWT nem sessão autenticada; consulte os avisos de segurança na [documentação da API](docs/api.md) antes de expor o serviço publicamente.

## Desenvolvimento

Consulte o [manual de utilização](docs/manual-usuario.md) para iniciar a aplicação. O frontend atualmente possui uma importação de desenvolvimento que aponta para um componente ausente (`BookCard.example`); até que ela seja corrigida, o comando de build não conclui.
