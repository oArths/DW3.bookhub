import { primeiroErro, type ResultadoValidacao } from "./validacoes";
import { toastWarn } from "./toast";

/**
 * Valida `dados` com um schema Zod. Se estiver tudo certo, devolve os dados
 * já limpos (com trim, etc.). Se falhar, mostra a primeira mensagem de erro
 * no toast e devolve `null`.
 *
 * Uso:
 *   const dados = validarComToast(loginFormSchema, { email, password });
 *   if (!dados) return;
 */
export function validarComToast<T>(
  schema: { safeParse: (dados: unknown) => ResultadoValidacao<T> },
  dados: unknown
): T | null {
  const resultado = schema.safeParse(dados);

  if (!resultado.success) {
    toastWarn(primeiroErro(resultado.error));
    return null;
  }

  return resultado.data;
}

/**
 * Igual ao `validarComToast`, mas devolve a mensagem de erro em vez de
 * mostrá-la no toast (útil quando a tela prefere exibir inline).
 */
export function validarComErro<T>(
  schema: { safeParse: (dados: unknown) => ResultadoValidacao<T> },
  dados: unknown
): { ok: true; data: T } | { ok: false; erro: string } {
  const resultado = schema.safeParse(dados);

  if (!resultado.success) {
    return { ok: false, erro: primeiroErro(resultado.error) };
  }

  return { ok: true, data: resultado.data };
}
