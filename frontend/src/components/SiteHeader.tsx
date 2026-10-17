import { Link } from "react-router-dom";
import SearchBooks from "./SearchBooks";
import { useSession } from "../store/session";

/**
 * Cabeçalho compartilhado pelo BookHub (catálogo, detalhes do livro e perfil).
 * Quando o usuário está logado, o botão da direita leva ao perfil (/home).
 */
export default function SiteHeader() {
  const user = useSession((state) => state.user);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/catalogo" className="text-lg font-extrabold tracking-tight text-violet-700">
          BookHub
        </Link>
        <nav className="hidden items-center gap-5 text-xs text-slate-500 sm:flex" aria-label="Navegação principal">
          <Link to="/catalogo" className="hover:text-violet-700">Início</Link>
          <Link to={user ? "/colecao" : "/login"} className="hover:text-violet-700">Minha Estante</Link>
        </nav>
        <SearchBooks className="hidden w-48 sm:block" />
        <Link
          to={user ? "/home" : "/login"}
          className="max-w-32 truncate rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100"
          aria-label={user ? `Perfil de ${user.username}` : "Entrar"}
        >
          {user ? user.username : "Entrar"}
        </Link>
      </div>
    </header>
  );
}
