import { useSession } from "../store/session";
import { toastWarn } from "../utils/toast";

const DEFAULT_MESSAGE = "Você precisa estar logado para continuar.";

/**
 * Centraliza a proteção de ações que exigem login.
 * Use `requireAuth()` antes de executar a ação: retorna `true` se o usuário
 * está logado e `false` (exibindo um toast) caso contrário.
 */
export function useRequireAuth() {
  const user = useSession((state) => state.user);

  function requireAuth(message: string = DEFAULT_MESSAGE): boolean {
    if (user) return true;

    toastWarn(message);
    return false;
  }

  return { user, isAuthenticated: Boolean(user), requireAuth };
}
