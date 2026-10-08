import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../header'
import Footer from '../footer'
import { mockBooks } from '../../data/mockBooks'

const categories = [
  'Todos',
  'Ficção',
  'Romance',
  'Sci-Fi',
  'Fantasia',
  'Biografia',
  'Autoajuda',
]

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="h-5 w-5 text-slate-500"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 5 5" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 0 0-1.176 0l-2.8 2.034c-.784.57-1.839-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.05 8.719c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 0 0 .95-.69l1.07-3.292Z" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className="h-4 w-4 text-slate-500"
    >
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CatalogoPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const navigate = useNavigate()

  const books = useMemo(() => {
    return mockBooks.filter((book) => {
      const matchesCategory =
        selectedCategory === 'Todos' || book.category === selectedCategory
      const matchesSearch = `${book.title} ${book.author} ${book.category}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [search, selectedCategory])

  return (
    <div className="min-h-screen bg-[#f7f4fb] text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#2d1b53] via-[#3c2363] to-[#4d2a7a] p-6 text-white shadow-[0_24px_60px_rgba(61,42,103,0.24)] md:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-100">
                Explore a sua próxima leitura
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.05em] md:text-5xl">
                Descubra histórias que transformam sua rotina.
              </h1>
              <p className="mt-4 max-w-lg text-base text-violet-100 md:text-lg">
                Milhares de livros selecionados para você descobrir, guardar e
                compartilhar com a comunidade BookHub.
              </p>
            </div>

            <div className="grid w-full max-w-xl gap-4 sm:grid-cols-3">
              {[
                { value: '240K', label: 'Leitores' },
                { value: '1.8M', label: 'Livros' },
                { value: '4.9/5', label: 'Avaliação' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-sm"
                >
                  <p className="text-2xl font-black tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-violet-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex w-full max-w-xl items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <SearchIcon />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="text"
              placeholder="Buscar por título, autor ou categoria"
              className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-[12px] px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                    active
                      ? 'bg-[#6f30d7] text-white shadow-[0_10px_20px_rgba(111,48,215,0.22)]'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
              Catálogo principal
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Livros em destaque
            </h2>
          </div>

          <div className="flex items-center gap-3 rounded-[14px] border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-sm text-slate-500">Ordenar por</span>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
            >
              Mais Populares
              <ChevronDownIcon />
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <article
                key={book.id}
                className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                <div
                  className={`flex h-52 flex-col justify-between bg-gradient-to-br ${book.accent} p-5 text-white`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                      {book.category}
                    </span>
                    <span className="rounded-full bg-black/10 px-2 py-1 text-xs font-medium">
                      {book.year}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-violet-100">
                      Livro
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight">
                      {book.cover}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">{book.author}</p>
                      <h4 className="mt-1 text-xl font-bold text-slate-900">
                        {book.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-600">
                      <StarIcon />
                      <span className="text-xs font-semibold">
                        {book.rating}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {book.blurb}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Preço
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        R$ {book.price.toFixed(2)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/detalhes-do-livro/${book.id}`)}
                      className="rounded-[12px] bg-[#6f30d7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b2ac4]"
                    >
                      Ver livro
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Sua próxima leitura</h3>
                <span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700">
                  Curado
                </span>
              </div>

              <div className="mt-5 rounded-[22px] bg-gradient-to-br from-[#4f2ba1] via-[#6f30d7] to-[#7d63ff] p-5 text-white shadow-md">
                <p className="text-[10px] uppercase tracking-[0.2em] text-violet-100">
                  Recomendado
                </p>
                <h4 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em]">
                  O mapa da sua próxima obsessão literária
                </h4>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  'Leituras curadas a cada semana',
                  'Recomendações por gosto pessoal',
                  'Novos destaques da comunidade',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-[16px] bg-slate-50 p-3 text-sm text-slate-700"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Top da semana</h3>

              <div className="mt-5 space-y-4">
                {[
                  { label: 'Duna', value: '98%' },
                  { label: 'Steve Jobs', value: '95%' },
                  { label: 'A Cidade do Sol', value: '91%' },
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-violet-600"
                          style={{ width: item.value }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}
