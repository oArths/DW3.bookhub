const navItems = ['Início', 'Catálogo', 'Autores', 'Resenhas', 'Contato']

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 5 5" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M3 4h2l2.3 9.3a1 1 0 0 0 1 .7h8.6a1 1 0 0 0 1-.8L18.8 7H7" />
      <circle cx="10" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#f8f5ff]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#6f30d7] text-lg font-black text-white shadow-[0_10px_18px_rgba(111,48,215,0.28)]">
            B
          </div>

          <div>
            <p className="text-lg font-black tracking-[-0.04em] text-slate-900">
              BookHub
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-slate-600 transition hover:text-[#6f30d7]"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Buscar"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#6f30d7] hover:text-[#6f30d7]"
          >
            <SearchIcon />
          </button>

          <button
            type="button"
            aria-label="Notificações"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#6f30d7] hover:text-[#6f30d7]"
          >
            <BellIcon />
          </button>

          <button
            type="button"
            aria-label="Carrinho"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#6f30d7] hover:text-[#6f30d7]"
          >
            <CartIcon />
          </button>

          <button
            type="button"
            className="rounded-full bg-[#6f30d7] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(111,48,215,0.28)] transition hover:bg-[#5b2ac4]"
          >
            Entrar
          </button>
        </div>
      </div>
    </header>
  )
}
