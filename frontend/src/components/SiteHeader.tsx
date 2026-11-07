import { Link } from "react-router-dom";
import SearchBooks from "./SearchBooks";
import { useSession } from "../store/session";
import { UserDeafult } from "../assets/";

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
          className="flex flex-row  items-center ">
          <img
            src={user ? user.avatarUrl : UserDeafult}
            alt={`Avatar de ${user ? user.username : "usuario"}`}
            className="h-12 w-12 rounded-full border cursor-pointer border-slate-200 bg-white object-cover"
          />
          <div
            // to={user ? "/home" : "/login"}
            className="max-w-32 truncate  px-3 py-1.5 text-xs font-semibold text-violet-700 "
            aria-label={user ? `Perfil de ${user.username}` : "Entrar"}
          >
            {user ? user.username : "Entrar"}
          </div>
        </Link>
      </div>
    </header>
  );
}
