const quickLinks = ['Sobre', 'Catálogo', 'Comunidade', 'Reviews', 'Contato']

const categories = ['Ficção', 'Romance', 'Fantasia', 'Biografia', 'Autoajuda']

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
    </svg>
  )
}

function IconTwitter() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M18.9 2h3.4l-7.4 8.5L23 22h-6.7l-5.2-7.3L5.4 22H2l7.9-9.1L1 2h6.9l4.7 6.7L18.9 2Zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20Z" />
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M10 9.5 15 12l-5 2.5v-5Z" fill="currentColor" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#1b1530] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[28px] border border-white/10 bg-white/5 p-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_1.1fr] md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-sm font-bold shadow-sm">
                B
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">BookHub</p>
                <p className="text-xs text-violet-200/80">
                  Leitura compartilhada
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-300">
              Conecte-se com leitores, descubra novos títulos e organize sua
              próxima grande leitura.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {[IconInstagram, IconTwitter, IconYoutube].map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-violet-300 hover:text-white"
                  aria-label="Social link"
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
              Navegação
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="transition hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
              Categorias
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {categories.map((category) => (
                <li key={category}>
                  <a href="#" className="transition hover:text-white">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
              Newsletter
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Receba recomendações exclusivas e novidades da comunidade BookHub.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none ring-0 transition focus:border-violet-400"
              />
              <button
                type="button"
                className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-400"
              >
                Assinar
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BookHub. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition hover:text-white">
              Termos
            </a>
            <a href="#" className="transition hover:text-white">
              Privacidade
            </a>
            <a href="#" className="transition hover:text-white">
              Ajuda
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
