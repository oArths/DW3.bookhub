import { useParams } from 'react-router-dom'
import Header from '../header'
import Footer from '../footer'
import { mockBooks } from '../../data/mockBooks'

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 0 0-1.176 0l-2.8 2.034c-.784.57-1.839-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.05 8.719c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 0 0 .95-.69l1.07-3.292Z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M12 2 5 5v6c0 4.8 2.8 8.9 7 11 4.2-2.1 7-6.2 7-11V5l-7-3Zm-1 14.5-3.5-3.5 1.4-1.4 2.1 2.1 4.1-4.1 1.4 1.4-5.5 5.5Z" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h3l3 3v3h-6v-6Z" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="17.5" cy="18" r="1.5" />
    </svg>
  )
}

export default function DetalhesDoLivroPage() {
  const { bookId } = useParams()
  const numericBookId = Number(bookId)
  const book =
    mockBooks.find((item) => item.id === numericBookId) ?? mockBooks[0]

  const relatedBooks = mockBooks.filter((item) =>
    book.relatedIds.includes(item.id),
  )

  return (
    <div className="min-h-screen bg-[#f7f4fb] text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)] lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
            <div className="flex justify-center lg:justify-start">
              <div
                className={`w-full max-w-[320px] overflow-hidden rounded-[28px] bg-gradient-to-br ${book.accent} p-5 text-white shadow-[0_28px_50px_rgba(111,48,215,0.28)]`}
              >
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100">
                  <span>{book.category}</span>
                  <span>{book.year}</span>
                </div>

                <div className="mt-10 flex min-h-[260px] flex-col justify-end">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-violet-100">
                    Livro principal
                  </p>
                  <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">
                    {book.cover}
                  </h2>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Livros</span>
                <span>/</span>
                <span>{book.category}</span>
              </div>

              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-900 md:text-5xl">
                    {book.title}
                  </h1>
                  <p className="mt-2 text-lg text-slate-600">{book.author}</p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-amber-600">
                  <StarIcon />
                  <span className="text-sm font-semibold">{book.rating}</span>
                  <span className="text-sm text-amber-700">
                    ({book.reviews.toLocaleString()} avaliações)
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
                  Best seller
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                  Em estoque
                </span>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
                {book.description}
              </p>

              <div className="mt-6 flex items-end gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Preço
                  </p>
                  <p className="mt-2 text-4xl font-black tracking-[-0.05em] text-slate-900">
                    {`R$ ${book.price.toFixed(2)}`.replace('.', ',')}
                  </p>
                </div>
                <span className="mb-2 text-base text-slate-400 line-through">
                  {`R$ ${(book.price + 10).toFixed(2)}`.replace('.', ',')}
                </span>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="rounded-[14px] bg-[#6f30d7] px-6 py-3 text-base font-semibold text-white shadow-[0_16px_30px_rgba(111,48,215,0.22)] transition hover:bg-[#5b2ac4]"
                >
                  Adicionar à Estante
                </button>
                <button
                  type="button"
                  className="rounded-[14px] border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-violet-200 hover:text-[#6f30d7]"
                >
                  Marcar como lido
                </button>
                <button
                  type="button"
                  className="rounded-[14px] border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-violet-200 hover:text-[#6f30d7]"
                >
                  Salvar
                </button>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: <ShieldIcon />, label: 'Compra segura' },
                  { icon: <TruckIcon />, label: 'Entrega em 48h' },
                  {
                    icon: <StarIcon filled />,
                    label: `Avaliação ${book.rating}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-[#6f30d7]">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="space-y-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">
                  Detalhes do livro
                </h2>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-700">
                  Resumo
                </span>
              </div>

              <p className="mt-5 text-base leading-7 text-slate-600">
                {book.detailSummary}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {book.details.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[18px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">
                  Avaliações
                </h2>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-[#6f30d7]"
                >
                  Escrever review
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {book.reviewsList.map((review) => (
                  <div
                    key={review.name}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-slate-900">
                          {review.name}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <StarIcon
                              key={`${review.name}-${index}`}
                              filled={index < review.stars}
                            />
                          ))}
                        </div>
                      </div>

                      <span className="text-sm font-medium text-slate-500">
                        {review.stars}/5
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.04)]">
              <h3 className="text-xl font-black tracking-[-0.03em] text-slate-900">
                Em destaque
              </h3>

              <div className="mt-5 rounded-[22px] bg-gradient-to-br from-[#4f2ba1] via-[#6f30d7] to-[#7d63ff] p-5 text-white shadow-md">
                <p className="text-[10px] uppercase tracking-[0.2em] text-violet-100">
                  Seleção da semana
                </p>
                <h4 className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em]">
                  Leitura que transforma a sua rotina
                </h4>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  'Leituras curadas por especialistas',
                  'Recomendações por seus gostos',
                  'Novos títulos toda semana',
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
          </aside>
        </section>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
                Recomendações
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">
                Livros relacionados
              </h2>
            </div>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-[12px] border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-[#6f30d7]"
            >
              Ver catálogo
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedBooks.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                <div
                  className={`flex h-40 flex-col justify-between bg-gradient-to-br ${item.accent} p-4 text-white`}
                >
                  <span className="w-fit rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                    Livro
                  </span>
                  <h3 className="text-2xl font-black tracking-[-0.05em]">
                    {item.cover}
                  </h3>
                </div>

                <div className="p-4">
                  <p className="text-sm text-slate-500">{item.author}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">
                      {`R$ ${item.price.toFixed(2)}`.replace('.', ',')}
                    </span>
                    <button
                      type="button"
                      className="rounded-[12px] bg-[#6f30d7] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#5b2ac4]"
                    >
                      Ver
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
