# Setup do backend BookHub

## Requisitos

- Node.js 20.19+ ou 22.12+ e npm.
- Instância MongoDB e URI de conexão.
- Credenciais Resend para testar recuperação de senha.
- Credenciais Penguin Random House somente para `GET /livros/busca`.

## Instalação e configuração

Na pasta `backend`:

```bash
npm ci
```

Crie um arquivo `.env` na pasta `backend`:

```dotenv
MONGO_URI=<uri-do-mongodb>
PORT=3000
RESEND_API_KEY=<chave-resend>
RESEND_FROM_EMAIL=<remetente-verificado-no-resend>
PRH_USERNAME=<usuario-prh>
PRH_PASSWORD=<senha-prh>
```

`PORT` é opcional (padrão `3000`). `RESEND_FROM_EMAIL` é opcional e o código usa `BookHub <onboarding@resend.dev>` quando omitida. `PRH_USERNAME` e `PRH_PASSWORD` são usados apenas pela busca de livros no backend. Não versione nem compartilhe segredos do `.env`.

## Iniciar e testar

```bash
npm start
```

O servidor conecta ao MongoDB e escuta em `http://localhost:3000`. Teste `GET /` para verificar a resposta de saúde. Os endpoints e exemplos estão em [API-INTEGRACAO.md](API-INTEGRACAO.md) e na [especificação completa](../../docs/api.md).

## Limitações de segurança

O backend não valida JWT ou sessão e não associa `usuarioId` enviado pelo cliente a uma identidade autenticada. O CORS está aberto. A configuração atual é apropriada apenas para desenvolvimento/demonstração; não publique o serviço sem implementar autenticação, autorização e política de CORS adequada.

## Problemas comuns

| Sintoma | Verificação |
|---|---|
| Servidor não inicia ou falha ao conectar | Confira `MONGO_URI`, conectividade e permissões de rede do MongoDB |
| `MODULE_NOT_FOUND` | Execute `npm ci` na pasta `backend` |
| `502` em `/livros/busca` | Confira `PRH_USERNAME` e `PRH_PASSWORD` e a disponibilidade do provedor |
| Código de recuperação não chega | Confira a chave e remetente Resend e os logs do servidor |
