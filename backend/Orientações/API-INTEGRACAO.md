# Integração com a API BookHub

Este arquivo foi mantido como ponto de entrada para quem já o utilizava. A especificação completa e atualizada, gerada a partir das rotas e validações do backend, está em [docs/api.md](../../docs/api.md).

O servidor local usa `http://localhost:3000`. Os prefixos reais são `/usuarios`, `/livros`, `/reviews` e `/listas`; não existe prefixo `/api`. Consulte também o [modelo de dados](../../docs/modelo-dados.md) e o [guia de setup](SETUP-BACKEND.md).

> A API atualmente não autentica as operações com JWT ou sessão. Não exponha os endpoints publicamente antes de implementar autenticação e autorização no servidor.
