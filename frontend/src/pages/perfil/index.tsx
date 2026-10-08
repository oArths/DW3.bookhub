import { useEffect, useState } from 'react'
import Header from '../header'
import Footer from '../footer'
import { mockBooks } from '../../data/mockBooks'

type ProfileBook = {
  title: string
  author: string
  category: string
  coverStyle: 'classic' | 'dystopian' | 'catalog'
  coverLabel?: string
}

const profile = {
  name: 'Lucas Gabriel Oliveira',
  shortName: 'Lucas Oliveira',
  username: 'lucas.oliveira',
  email: 'lucas.oliveira@email.com',
}

const profileBooks: ProfileBook[] = [
  {
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    category: 'Romance',
    coverStyle: 'classic',
  },
  {
    title: '1984',
    author: 'George Orwell',
    category: 'Ficção distópica',
    coverStyle: 'dystopian',
  },
  {
    title: mockBooks[0].title,
    author: mockBooks[0].author,
    category: mockBooks[0].category,
    coverStyle: 'catalog',
    coverLabel: mockBooks[0].cover,
  },
]

const profileFields = [
  { label: 'Nome completo', value: profile.name, icon: 'user.svg' },
  { label: 'Nome de usuário', value: profile.username, icon: 'user.svg' },
  { label: 'E-mail', value: profile.email, icon: 'mail.svg' },
  { label: 'Senha', value: '••••••••', icon: 'lock.svg' },
]

const accountLinks = [
  {
    label: 'Informações pessoais',
    icon: 'settings.svg',
    href: '#informacoes-pessoais',
    active: true,
  },
  { label: 'Minha estante', icon: 'library.svg', href: '#livros-salvos' },
  { label: 'Livros salvos', icon: 'bookmark.svg', href: '#livros-salvos' },
  { label: 'Coleções de livros', icon: 'layers.svg', href: '#colecoes' },
  { label: 'Resenhas de livros', icon: 'reviews.svg', href: '#resenhas' },
]

const collections = [
  {
    title: 'Clássicos da literatura',
    count: '2 livros',
    books: [profileBooks[0], profileBooks[1]],
  },
  {
    title: 'Próximas leituras',
    count: '1 livro',
    books: [profileBooks[2]],
  },
]

const reviews = [
  {
    title: 'Dom Casmurro',
    stars: '/perfil/icons/star-rating.svg',
    text: 'Um clássico que mantém o leitor em dúvida do início ao fim. A narrativa de Bentinho é deliciosamente ambígua e a releitura ainda vale a pena.',
    date: '12 de setembro de 2026',
  },
  {
    title: '1984',
    stars: '/perfil/icons/star-rating-4.svg',
    text: 'Assustadoramente atual. A construção do mundo é impecável, embora o ritmo do meio do livro seja um pouco lento. Recomendo para qualquer leitor.',
    date: '28 de agosto de 2026',
  },
]

function ProfileIcon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <img
      src={`/perfil/icons/${name}`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className="shrink-0"
    />
  )
}

function MenuIcon({ close = false }: { close?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      {close ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  )
}

function BookCover({
  book,
  className = '',
}: {
  book: ProfileBook
  className?: string
}) {
  if (book.coverStyle === 'catalog') {
    return (
      <div
        className={`flex min-h-0 flex-col justify-between overflow-hidden rounded-sm border border-black/10 bg-linear-to-br from-[#372766] via-[#7548bd] to-[#271c50] p-2 text-white ${className}`}
      >
        <span className="text-[7px] font-semibold uppercase tracking-[0.14em] text-white/75">
          Ficção
        </span>
        <span className="text-center text-[10px] font-black leading-tight">
          {book.coverLabel}
        </span>
      </div>
    )
  }

  if (book.coverStyle === 'dystopian') {
    return (
      <div
        className={`relative flex min-h-0 flex-col items-center justify-between overflow-hidden rounded-sm border border-black/10 bg-[#c92723] px-1.5 py-2 text-[#171717] ${className}`}
      >
        <span className="relative mt-1 flex h-7 w-full items-center justify-center rounded-[50%] border-[3px] border-[#1b1a19] bg-[#f2e7c9] text-base leading-none">
          <span className="h-3 w-3 rounded-full bg-[#171717]" />
        </span>
        <span className="font-black leading-[0.82] tracking-[-0.06em] text-[19px]">
          1984
        </span>
        <span className="text-[6px] font-semibold uppercase tracking-[0.12em] text-[#f4e9d3]">
          George Orwell
        </span>
      </div>
    )
  }

  return (
    <div
      className={`relative flex min-h-0 flex-col items-center justify-between overflow-hidden rounded-sm border border-[#9b8654] bg-[#173326] px-1.5 py-2 text-[#e4d4a3] ${className}`}
    >
      <span className="text-center font-serif text-[10px] font-bold uppercase leading-[0.95]">
        Dom
        <br />
        Casmurro
      </span>
      <span className="w-full border-t border-[#b8a36c]/70 pt-1 text-center font-serif text-[6px] uppercase tracking-[0.12em]">
        Machado de Assis
      </span>
    </div>
  )
}

export default function PerfilPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedAccountLink, setSelectedAccountLink] = useState(
    'Informações pessoais',
  )

  useEffect(() => {
    if (!mobileMenuOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileMenuOpen])

  return (
    <div className="min-h-screen bg-[#f8f8fc] font-sans text-[#151522]">
      <Header />

      <main className="mx-auto grid w-full max-w-380 gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[313px_minmax(0,1fr)] xl:gap-12.5 xl:px-0 xl:py-17.5">
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="profile-account-menu"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-11 w-fit items-center gap-2 rounded-lg border border-[#dfdfe9] bg-white px-4 text-sm font-medium text-[#151522] shadow-sm transition hover:border-[#914bff] hover:text-[#914bff] lg:hidden"
        >
          <MenuIcon />
          Menu da conta
        </button>

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Fechar menu da conta"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-[#151522]/35 lg:hidden"
          />
        )}

        <aside
          id="profile-account-menu"
          role={mobileMenuOpen ? 'dialog' : undefined}
          aria-modal={mobileMenuOpen ? true : undefined}
          aria-label="Menu da conta"
          className={`${
            mobileMenuOpen
              ? 'fixed inset-y-0 left-0 z-50 block w-[min(86vw,320px)] overflow-y-auto border-r border-[#dfdfe9] bg-[#f8f8fc] p-5 shadow-2xl'
              : 'hidden'
          } lg:sticky lg:top-24 lg:block lg:w-full lg:self-start lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <p className="text-base font-semibold text-[#151522]">
              Menu da conta
            </p>
            <button
              type="button"
              aria-label="Fechar menu da conta"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dfdfe9] bg-white text-[#737a8b] hover:text-[#914bff]"
            >
              <MenuIcon close />
            </button>
          </div>

          <div className="flex items-center gap-3 pl-2.5">
            <img
              src="/perfil/profile-avatar-source.png"
              alt="Avatar de Lucas Oliveira"
              className="h-14 w-14 rounded-full object-cover xl:h-17.5 xl:w-17.5"
            />
            <p className="text-base font-semibold leading-6 text-[#151522]">
              Lucas Oliveira
            </p>
          </div>

          <nav aria-label="Menu da conta" className="mt-6 flex flex-col gap-1">
            {accountLinks.map((item) => {
              const isSelected = selectedAccountLink === item.label

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setSelectedAccountLink(item.label)
                    setMobileMenuOpen(false)
                  }}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-lg px-4 text-sm transition-colors xl:min-h-14 xl:text-base ${
                    isSelected
                      ? 'bg-[#f0eaff] font-medium text-[#914bff]'
                      : 'text-[#737a8b] hover:bg-[#f0eaff] hover:text-[#914bff]'
                  }`}
                >
                  <ProfileIcon name={item.icon} />
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="mt-5 border-t border-[#dfdfe9] pt-4">
            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-12 items-center gap-3 pl-5 text-sm text-[#737a8b] transition-colors hover:text-[#914bff] xl:text-base"
            >
              <ProfileIcon name="logout.svg" />
              Sair
            </a>
          </div>
        </aside>

        <div className="min-w-0">
          <section id="informacoes-pessoais" aria-labelledby="profile-title">
            <header>
              <p className="text-sm font-medium leading-6 text-[#914bff]">
                MINHA CONTA
              </p>
              <h1
                id="profile-title"
                className="mt-1 text-3xl font-semibold leading-tight text-[#151522] sm:text-4xl xl:text-[44px] xl:leading-13.25"
              >
                Informações pessoais
              </h1>
              <p className="mt-1 text-sm leading-6 text-[#737a8b] xl:text-base">
                Gerencie os dados vinculados à sua conta.
              </p>
            </header>

            <div className="flex flex-wrap items-center gap-4 py-7 xl:gap-5 xl:pb-7.5 xl:pt-10">
              <img
                src="/perfil/profile-avatar-source.png"
                alt=""
                aria-hidden="true"
                className="h-19 w-19 rounded-full object-cover xl:h-25 xl:w-25"
              />
              <div className="min-w-40 flex-1">
                <p className="text-base font-semibold text-[#151522]">
                  Avatar do perfil
                </p>
                <p className="mt-1 text-sm text-[#737a8b]">
                  Seleção obrigatória
                </p>
              </div>
              <button
                type="button"
                className="h-10 rounded-md border border-[#dfdfe9] bg-[#f8f8fc] px-3 text-sm font-medium text-[#151522] shadow-sm transition hover:border-[#914bff]"
              >
                <span aria-hidden="true" className="mr-2 text-base">
                  ✎
                </span>
                Escolher avatar
              </button>
            </div>

            <div className="border-t border-[#dfdfe9] pt-6 xl:pt-7.5">
              <div className="overflow-hidden rounded-[10px] border border-[#dfdfe9] bg-white shadow-[0_12px_28px_-10px_rgba(21,21,34,0.04)]">
                {profileFields.map((field, index) => (
                  <div
                    key={field.label}
                    className={`flex min-h-20.5 items-center gap-4 px-4 py-4 sm:px-6 xl:min-h-30 xl:gap-5 xl:px-7.5 ${
                      index < profileFields.length - 1
                        ? 'border-b border-[#dfdfe9]'
                        : ''
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0eaff] xl:h-12.5 xl:w-12.5">
                      <ProfileIcon name={field.icon} size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-6 text-[#737a8b]">
                        {field.label}
                      </p>
                      <p className="wrap-break-word text-sm font-semibold leading-6 text-[#151522] xl:text-base">
                        {field.value}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="group flex shrink-0 items-center gap-2 rounded-md px-2 py-1 text-sm text-[#914bff] transition-colors hover:bg-[#f0eaff] hover:text-[#7235dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#914bff]"
                    >
                      <span className="transition-transform group-hover:scale-110">
                        <ProfileIcon name="edit.svg" />
                      </span>
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="livros-salvos"
            aria-labelledby="saved-books-title"
            className="mt-10 border-t border-[#dfdfe9] pt-8 xl:mt-12.5 xl:pt-10"
          >
            <h2
              id="saved-books-title"
              className="flex items-center gap-3 text-xl font-semibold leading-8 text-[#151522] xl:text-[26px]"
            >
              <ProfileIcon name="bookmark-section.svg" size={24} />
              Livros salvos
            </h2>
            <div className="mt-4 grid gap-4 xl:grid-cols-2 xl:gap-5">
              {profileBooks.slice(0, 2).map((book) => (
                <article
                  key={book.title}
                  className="flex min-h-33 items-start gap-4 rounded-[10px] border border-[#dfdfe9] bg-white p-4 shadow-[0_12px_28px_-10px_rgba(21,21,34,0.04)] xl:min-h-40.5 xl:gap-5 xl:p-5"
                >
                  <BookCover
                    book={book}
                    className="h-27 w-18 xl:h-30 xl:w-20"
                  />
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-base font-semibold leading-6 text-[#151522]">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#737a8b]">
                      {book.author}
                    </p>
                    <span className="mt-1 inline-flex rounded-full bg-[#f3f3f8] px-3 py-1 text-xs leading-5 text-[#737a8b]">
                      {book.category}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="colecoes"
            aria-labelledby="collections-title"
            className="mt-8 border-t border-[#dfdfe9] pt-8 xl:mt-0 xl:pt-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 xl:pb-6">
              <h2
                id="collections-title"
                className="flex items-center gap-3 text-xl font-semibold leading-8 text-[#151522] xl:text-[26px]"
              >
                <ProfileIcon name="layers-section.svg" size={24} />
                Coleções de livros
              </h2>
              <button
                type="button"
                className="h-10 rounded-md border border-[#dfdfe9] bg-[#f8f8fc] px-3 text-sm font-medium text-[#151522] shadow-sm transition hover:border-[#914bff]"
              >
                +&nbsp; Nova coleção
              </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-2 xl:gap-7.5">
              {collections.map((collection) => (
                <article key={collection.title}>
                  <div className="grid aspect-square grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-[10px] border border-[#dfdfe9] bg-[#f3f3f8] p-2.5">
                    {Array.from({ length: 4 }).map((_, coverIndex) => {
                      const book = collection.books[coverIndex]
                      return book ? (
                        <BookCover
                          key={`${collection.title}-${coverIndex}`}
                          book={book}
                          className="h-full w-full"
                        />
                      ) : (
                        <div
                          key={`${collection.title}-empty-${coverIndex}`}
                          className="flex items-center justify-center rounded-sm bg-[#f8f8fc]"
                        >
                          <ProfileIcon name="book-open.svg" size={18} />
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium leading-6 text-[#151522] xl:text-base">
                        {collection.title}
                      </h3>
                      <p className="text-xs leading-5 text-[#737a8b]">
                        {collection.count}
                      </p>
                    </div>
                    <ProfileIcon name="folder.svg" size={20} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="resenhas"
            aria-labelledby="reviews-title"
            className="mt-8 border-t border-[#dfdfe9] pt-8 xl:mt-0 xl:pt-10"
          >
            <h2
              id="reviews-title"
              className="flex items-center gap-3 text-xl font-semibold leading-8 text-[#151522] xl:text-[26px]"
            >
              <ProfileIcon name="reviews-section.svg" size={24} />
              Resenhas de livros
            </h2>
            <div className="mt-4 flex flex-col gap-4 xl:gap-5">
              {reviews.map((review) => (
                <article
                  key={review.title}
                  className="flex min-h-34.5 flex-col gap-2.5 rounded-[10px] border border-[#dfdfe9] bg-white p-4 shadow-[0_12px_28px_-10px_rgba(21,21,34,0.04)] xl:min-h-43 xl:p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-[#151522] xl:text-base">
                      {review.title}
                    </h3>
                    <img
                      src={review.stars}
                      width={97}
                      height={17}
                      alt={
                        review.title === '1984'
                          ? '4 de 5 estrelas'
                          : '5 de 5 estrelas'
                      }
                      className="h-4.25 w-24.25 shrink-0"
                    />
                  </div>
                  <p className="text-sm leading-6 text-[#737a8b] xl:text-base">
                    {review.text}
                  </p>
                  <p className="text-xs leading-5 text-[#969dae]">
                    {review.date}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
