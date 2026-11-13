# Autenticação BookHub — contrato atual

Este arquivo substitui o contrato antigo de `/api/auth`, JWT e OAuth, que não correspondia ao backend. A especificação completa está em [`docs/api.md`](../../../../docs/api.md).

## Endpoints implementados

| Método | Caminho | Descrição |
|---|---|---|
| `POST` | `/usuarios` | Cadastro |
| `POST` | `/usuarios/login` | Validação de e-mail e senha |
| `POST` | `/usuarios/forgot-password` | Solicita código por e-mail |
| `POST` | `/usuarios/verify-reset-code` | Valida código |
| `POST` | `/usuarios/reset-password` | Altera senha |
| `GET` | `/usuarios/:id` | Consulta perfil |
| `PATCH` | `/usuarios/:id` | Atualiza perfil |

O host local é `http://localhost:3000`. Os corpos, respostas, validações e status HTTP estão detalhados na [especificação da API](../../../../docs/api.md#usuarios).

## Limitação importante

O login não retorna JWT, cookie ou sessão; retorna apenas o documento do usuário sem `passwordHash`. Embora `jsonwebtoken` exista nas dependências, não é usado pelo fluxo atual. A persistência de estado no frontend não autentica requisições ao backend. Não considere as rotas protegidas contra acesso não autorizado em produção.
