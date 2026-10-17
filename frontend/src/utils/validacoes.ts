import { z } from "zod";

// Validações espelhadas do back-end (backend/schemas/index.js).
// Servem para barrar dados inválidos no formulário antes de enviar a
// requisição, mostrando a mesma mensagem que a API devolveria.

// ObjectId do MongoDB (24 caracteres hexadecimais).
export const objectIdSchema = z
  .string({ error: "id inválido." })
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "id inválido.");

// E-mail no formato usuario@dominio.
export const emailSchema = z
  .string({ error: "Informe um e-mail válido." })
  .trim()
  .email("Informe um e-mail válido.");

// Senha: 8 a 72 caracteres.
export const senhaSchema = z
  .string({ error: "A senha é obrigatória." })
  .min(8, "A senha deve ter no mínimo 8 caracteres.")
  .max(72, "A senha deve ter no máximo 72 caracteres.");

// Nome de usuário: 3 a 30 caracteres, sem espaços.
export const usernameSchema = z
  .string({ error: "O nome de usuário é obrigatório." })
  .trim()
  .min(3, "O nome de usuário deve ter no mínimo 3 caracteres.")
  .max(30, "O nome de usuário deve ter no máximo 30 caracteres.")
  .regex(/^\S+$/, "O nome de usuário não pode conter espaços.");

// Nome de exibição (pode conter espaços): 2 a 80 caracteres.
export const nomeSchema = z
  .string({ error: "nome inválido." })
  .trim()
  .min(2, "O nome deve ter no mínimo 2 caracteres.")
  .max(80, "O nome deve ter no máximo 80 caracteres.");

export const bioSchema = z
  .string({ error: "bio inválida." })
  .max(300, "A bio deve ter no máximo 300 caracteres.");

// URL do avatar: aceita vazio ou uma URL válida.
export const avatarUrlSchema = z.union(
  [z.literal(""), z.string().trim().url("Informe uma URL de avatar válida.")],
  { error: "Informe uma URL de avatar válida." }
);

// Código de verificação enviado por e-mail (4 a 8 dígitos).
export const codigoSchema = z
  .string({ error: "Informe o código." })
  .trim()
  .regex(/^\d{4,8}$/, "O código deve conter de 4 a 8 dígitos.");

// Lista / coleção.
export const nomeListaSchema = z
  .string({ error: "O nome da lista é obrigatório." })
  .trim()
  .min(1, "O nome da lista é obrigatório.")
  .max(100, "O nome da lista deve ter no máximo 100 caracteres.");

export const descricaoListaSchema = z
  .string({ error: "descrição inválida." })
  .max(300, "A descrição deve ter no máximo 300 caracteres.");

export const statusLeituraSchema = z.enum(
  ["quero_ler", "lendo", "lido", "abandonado"],
  { error: "statusLeitura deve ser um de: quero_ler, lendo, lido, abandonado." }
);

export const livroSchema = z.object({
  idExterno: z
    .string({ error: "idExterno é obrigatório." })
    .trim()
    .min(1, "idExterno é obrigatório.")
    .max(120, "idExterno muito longo."),
  titulo: z
    .string({ error: "titulo é obrigatório." })
    .trim()
    .min(1, "titulo é obrigatório.")
    .max(300, "titulo muito longo."),
  capaUrl: z
    .string({ error: "capaUrl inválida." })
    .trim()
    .max(500, "capaUrl muito longa.")
    .optional(),
});

// Avaliação: nota inteira de 0 a 5 e texto de até 2000 caracteres.
export const notaSchema = z.coerce
  .number({ error: "A nota é obrigatória." })
  .int("A nota deve ser um número inteiro.")
  .min(0, "A nota deve estar entre 0 e 5.")
  .max(5, "A nota deve estar entre 0 e 5.");

export const textoSchema = z
  .string({ error: "texto inválido." })
  .max(2000, "O texto deve ter no máximo 2000 caracteres.");

// ---------------------------------------------------------------------------
// Schemas dos formulários (juntam os campos de cada tela)
// ---------------------------------------------------------------------------

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z
    .string({ error: "A senha é obrigatória." })
    .min(1, "Informe a senha."),
});

export const cadastroFormSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: senhaSchema,
    confirmacao: z
      .string({ error: "Confirme a senha." })
      .min(1, "Confirme a senha."),
  })
  .refine((dados) => dados.password === dados.confirmacao, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmacao"],
  });

export const novaSenhaFormSchema = z
  .object({
    password: senhaSchema,
    confirmacao: z
      .string({ error: "Confirme a senha." })
      .min(1, "Confirme a senha."),
  })
  .refine((dados) => dados.password === dados.confirmacao, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmacao"],
  });

export const emailFormSchema = z.object({ email: emailSchema });

export const codigoFormSchema = z.object({ code: codigoSchema });

export const colecaoFormSchema = z.object({
  nome: nomeListaSchema,
  descricao: descricaoListaSchema.optional(),
});

export const reviewFormSchema = z.object({
  nota: notaSchema.refine((nota) => nota >= 1, "Escolha uma nota de 1 a 5 estrelas."),
  texto: textoSchema.optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Devolve a mensagem do primeiro problema encontrado pelo Zod. */
export function primeiroErro(erro: z.ZodError): string {
  return erro.issues[0]?.message ?? "Dados inválidos.";
}

export type ResultadoValidacao<T> =
  | { success: true; data: T }
  | { success: false; error: z.ZodError };
