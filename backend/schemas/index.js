const { z } = require('zod');
const { STATUS_LEITURA } = require('../models/ListaLivro');

// ---------------------------------------------------------------------------
// Validações compartilhadas (feitas com Zod)
// ---------------------------------------------------------------------------

// ObjectId do MongoDB: 24 caracteres hexadecimais.
const objectId = z
  .string({ error: 'id inválido.' })
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, 'id inválido.');

// E-mail no formato usuario@dominio.
const email = z
  .string({ error: 'Informe um e-mail válido.' })
  .trim()
  .email('Informe um e-mail válido.');

// Senha: mínimo de 8 caracteres (mesmo limite usado no front).
// O bcrypt ignora bytes após 72, então limitamos para evitar surpresas.
const senha = z
  .string({ error: 'A senha é obrigatória.' })
  .min(8, 'A senha deve ter no mínimo 8 caracteres.')
  .max(72, 'A senha deve ter no máximo 72 caracteres.');

// Nome de usuário: 3 a 30 caracteres, sem espaços.
const username = z
  .string({ error: 'O nome de usuário é obrigatório.' })
  .trim()
  .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres.')
  .max(30, 'O nome de usuário deve ter no máximo 30 caracteres.')
  .regex(/^\S+$/, 'O nome de usuário não pode conter espaços.');

// Código de verificação enviado por e-mail (apenas dígitos).
const codigo = z
  .string({ error: 'Informe o código.' })
  .trim()
  .regex(/^\d{4,8}$/, 'O código deve conter de 4 a 8 dígitos.');

// Status de leitura de um livro dentro de uma lista.
const statusLeitura = z.enum(STATUS_LEITURA, {
  error: `statusLeitura deve ser um de: ${STATUS_LEITURA.join(', ')}.`,
});

// ---------------------------------------------------------------------------
// Schemas por rota
// ---------------------------------------------------------------------------

// POST /usuarios (cadastro)
const cadastroSchema = z.object({
  username,
  email,
  password: senha,
  bio: z
    .string({ error: 'bio inválida.' })
    .max(300, 'A bio deve ter no máximo 300 caracteres.')
    .nullish(),
  nome: z
    .string({ error: 'nome inválido.' })
    .trim()
    .max(80, 'O nome deve ter no máximo 80 caracteres.')
    .optional(),
});

// POST /usuarios/login
const loginSchema = z.object({
  email,
  // No login não exigimos o tamanho mínimo: apenas que a senha veio.
  password: z.string({ error: 'A senha é obrigatória.' }).min(1, 'Informe a senha.'),
});

// POST /usuarios/forgot-password
const esqueciSenhaSchema = z.object({ email });

// POST /usuarios/verify-reset-code
const verificarCodigoSchema = z.object({ email, code: codigo });

// POST /usuarios/reset-password
const redefinirSenhaSchema = z.object({ email, code: codigo, password: senha });

// PATCH /usuarios/:id (perfil)
const atualizarUsuarioSchema = z
  .object({
    nome: z
      .string({ error: 'nome inválido.' })
      .trim()
      .min(2, 'O nome deve ter no mínimo 2 caracteres.')
      .max(80, 'O nome deve ter no máximo 80 caracteres.')
      .optional(),
    username: username.optional(),
    bio: z
      .string({ error: 'bio inválida.' })
      .max(300, 'A bio deve ter no máximo 300 caracteres.')
      .nullish(),
    avatarUrl: z
      .union([z.literal(''), z.string().trim().url('Informe uma URL de avatar válida.')], {
        error: 'Informe uma URL de avatar válida.',
      })
      .optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  });

// POST /livros
const livroSchema = z.object({
  idExterno: z
    .string({ error: 'idExterno é obrigatório.' })
    .trim()
    .min(1, 'idExterno é obrigatório.')
    .max(120, 'idExterno muito longo.'),
  titulo: z
    .string({ error: 'titulo é obrigatório.' })
    .trim()
    .min(1, 'titulo é obrigatório.')
    .max(300, 'titulo muito longo.'),
  capaUrl: z
    .string({ error: 'capaUrl inválida.' })
    .trim()
    .max(500, 'capaUrl muito longa.')
    .optional(),
});

// POST /reviews
const reviewSchema = z.object({
  usuarioId: objectId,
  livroId: objectId,
  nota: z.coerce
    .number({ error: 'A nota é obrigatória.' })
    .int('A nota deve ser um número inteiro.')
    .min(0, 'A nota deve estar entre 0 e 5.')
    .max(5, 'A nota deve estar entre 0 e 5.'),
  texto: z
    .string({ error: 'texto inválido.' })
    .max(2000, 'O texto deve ter no máximo 2000 caracteres.')
    .optional(),
});

// POST /listas
const listaSchema = z.object({
  usuarioId: objectId,
  nome: z
    .string({ error: 'O nome da lista é obrigatório.' })
    .trim()
    .min(1, 'O nome da lista é obrigatório.')
    .max(100, 'O nome da lista deve ter no máximo 100 caracteres.'),
  descricao: z
    .string({ error: 'descrição inválida.' })
    .max(300, 'A descrição deve ter no máximo 300 caracteres.')
    .nullish(),
});

// POST /listas/:listaId/livros
const adicionarLivroListaSchema = z.object({
  usuarioId: objectId,
  livroId: objectId,
  statusLeitura: statusLeitura.optional(),
});

// PATCH /listas/:listaId/livros/:livroId
const atualizarStatusSchema = z.object({
  usuarioId: objectId,
  statusLeitura,
});

// ---------------------------------------------------------------------------
// Middleware: valida req.body e devolve 400 com a mensagem do problema.
// Os dados validados (já com trim, etc.) substituem req.body.
// ---------------------------------------------------------------------------
function validarCorpo(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const erros = resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.') || null,
        mensagem: issue.message,
      }));

      return res.status(400).json({ erro: erros[0].mensagem, erros });
    }

    req.body = resultado.data;
    next();
  };
}

module.exports = {
  validarCorpo,
  cadastroSchema,
  loginSchema,
  esqueciSenhaSchema,
  verificarCodigoSchema,
  redefinirSenhaSchema,
  atualizarUsuarioSchema,
  livroSchema,
  reviewSchema,
  listaSchema,
  adicionarLivroListaSchema,
  atualizarStatusSchema,
};
