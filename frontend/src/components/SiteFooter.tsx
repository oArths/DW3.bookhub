import { useSession } from "../store/session";

export default function SiteFooter() {
  const user = useSession((state) => state.user);

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:grid-cols-3">
        <div>
          <h2 className="font-bold text-white">BookHub</h2>
          <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
            Descubra livros, compartilhe resenhas e encontre sua próxima leitura.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-white">Plataforma</h3>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
            <li><a href="/catalogo" className="hover:text-white">Catálogo</a></li>
            <li><a href={user ? "/home" : "/login"} className="hover:text-white">Perfil</a></li>
            <li><a href={user ? "/colecao" : "/login"} className="hover:text-white">Estante</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-white">Suporte</h3>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
            <li><a href="mailto:onboarding@resend.dev" className="hover:text-white">Fale conosco</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-slate-800 px-5 py-4 text-[10px] text-slate-500">
        © 2026 BookHub. Todos os direitos reservados. Dados fornecidos pela Open Library.
      </div>
    </footer>
  );
}
