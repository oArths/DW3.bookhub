import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bookCatalog, type Book } from "../../data/books";
import ReviewForm from "../../components/ReviewForm";

interface BookDetailsProps {
  book?: Book;
  suggestions?: Book[];
}

function StarRating({ rating, showValue = false }: { rating: number; showValue?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label={`Nota ${rating} de 5`}>
      {showValue && <strong className="text-slate-900">{rating.toFixed(1)}</strong>}
      <span className="tracking-[0.12em] text-amber-400" aria-hidden="true">
        ★★★★★
      </span>
    </span>
  );
}

function BookCover({ src, title, className = "" }: { src?: string; title: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-slate-50 ${className}`}
      aria-label={`Capa do livro ${title}`}
    >
      {src ? (
        <img src={src} alt={`Capa de ${title}`} className="h-full w-full object-cover" />
      ) : (
        <div className="h-[78%] w-[72%] rounded-sm border border-slate-200 bg-white shadow-sm" />
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-5 px-5">
        <Link to="/catalogo" className="text-lg font-extrabold tracking-tight text-violet-700">
          BookHub
        </Link>
        <nav className="hidden items-center gap-5 text-xs text-slate-500 sm:flex" aria-label="Navegação principal">
          <Link to="/catalogo" className="hover:text-violet-700">Início</Link>
          <Link to="/catalogo" className="font-semibold text-violet-700">Catálogo</Link>
          <Link to="/" className="hover:text-violet-700">Minha Estante</Link>
          <Link to="/" className="hover:text-violet-700">Comunidade</Link>
        </nav>
        <button
          type="button"
          className="hidden rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-500 sm:block"
          aria-label="Pesquisar livros"
        >
          Buscar livros, autores...
        </button>
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-label="Usuário conectado" />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:grid-cols-3">
        <div>
          <h2 className="font-bold text-white">BookHub</h2>
          <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sua próxima leitura começa aqui.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-white">Plataforma</h3>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
            <li><a href="#sugestoes" className="hover:text-white">Nossos livros</a></li>
            <li><a href="#detalhes" className="hover:text-white">Comunidade de leitores</a></li>
            <li><a href="#avaliacoes" className="hover:text-white">Sobre o BookHub</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-white">Suporte</h3>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
            <li><a href="mailto:suporte@bookhub.com" className="hover:text-white">Ajuda</a></li>
            <li><a href="mailto:suporte@bookhub.com" className="hover:text-white">Fale conosco</a></li>
            <li><a href="#topo" className="hover:text-white">Privacidade</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-slate-800 px-5 py-4 text-[10px] text-slate-500">
        © 2025 BookHub. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default function LivroDetalhes({
  book: providedBook,
  suggestions: providedSuggestions,
}: BookDetailsProps) {
  const { id } = useParams();
  const book = providedBook ?? bookCatalog.find((item) => item.id === id) ?? bookCatalog[0];
  const suggestions =
    providedSuggestions ?? bookCatalog.filter((item) => item.id !== book.id).slice(0, 4);
  const [wantsToRead, setWantsToRead] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  return (
    <div id="topo" className="min-h-screen bg-white font-sans text-slate-900">
      <Header />

      <main>
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-5 pb-7 pt-4">
            <nav aria-label="Breadcrumb" className="mb-5 text-[11px] text-slate-400">
              <Link to="/catalogo" className="hover:text-violet-700">Catálogo</Link>
              <span className="px-2">›</span>
              <span className="text-violet-600">{book.title}</span>
            </nav>

            <div className="grid gap-6 md:grid-cols-[minmax(220px,280px)_1fr]">
              <div>
                <div className="rounded-xl bg-violet-50 p-3">
                  <BookCover src={book.cover} title={book.title} className="h-52 rounded-md sm:h-64" />
                  <p className="mt-2 text-center text-[10px] text-slate-500">▧ Capa do livro</p>
                </div>
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-100 text-violet-600" aria-hidden="true">▣</span>
                  <div>
                    <p className="text-xs font-semibold">Disponível na estante</p>
                    <p className="text-[10px] text-slate-400">Leitores também estão lendo</p>
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex gap-2">
                  <span className="rounded bg-violet-700 px-2 py-1 text-[10px] font-semibold text-white">Destaque</span>
                  <span className="rounded border border-violet-300 px-2 py-1 text-[10px] font-medium text-violet-700">
                    {book.genres[0] ?? "Livro"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{book.title}</h1>
                <p className="mt-1 text-xs text-slate-500">por {book.author}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <StarRating rating={book.rating} showValue />
                  <span>{book.reviewCount} reviews publicadas</span>
                </div>
                {userRating !== null && (
                  <p className="mt-2 text-xs font-medium text-violet-700" role="status">
                    Sua nota: {userRating} de 5 estrelas
                  </p>
                )}

                <div className="mt-4">
                  <h2 className="text-xs font-bold">Descrição</h2>
                  <p className="mt-1 whitespace-pre-line text-xs leading-5 text-slate-500">{book.description}</p>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h2 className="text-xs font-bold">Informações do produto</h2>
                  <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                    {[
                      ["Editora", book.publisher],
                      ["Publicação", book.publicationDate],
                      ["Idioma", book.language],
                      ["Páginas", String(book.pages)],
                      ["ISBN", book.isbn],
                      ["Categorias", book.genres.join(", ")],
                    ].map(([label, value]) => (
                      <div key={label} className="min-w-0">
                        <dt className="text-[10px] text-slate-400">{label}</dt>
                        <dd className="mt-0.5 truncate text-[11px] font-medium text-slate-700">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setWantsToRead((current) => !current)}
                    aria-pressed={wantsToRead}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition ${
                      wantsToRead ? "bg-emerald-600 hover:bg-emerald-700" : "bg-violet-700 hover:bg-violet-800"
                    }`}
                  >
                    {wantsToRead ? "Adicionado à estante" : "Adicionar à estante"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasRead((current) => !current)}
                    aria-pressed={hasRead}
                    className="rounded-lg border border-violet-300 px-4 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-50"
                  >
                    {hasRead ? "Marcar como não lido" : "Marcar como lido"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaved((current) => !current)}
                    aria-pressed={saved}
                    className="rounded-lg border border-violet-300 px-4 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-50"
                  >
                    {saved ? "Salvo" : "Salvar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="detalhes" className="mx-auto max-w-6xl px-5 py-8">
          <div className="mb-4">
            <h2 className="text-base font-bold">Detalhes do livro</h2>
            <p className="mt-1 text-[11px] text-slate-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_280px]">
            <article className="rounded-xl border border-slate-200 bg-violet-50/40 p-4">
              <h3 className="text-xs font-bold">Sobre o livro</h3>
              <p className="mt-2 whitespace-pre-line text-[11px] leading-5 text-slate-500">{book.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {book.genres.map((genre) => (
                  <span key={genre} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-600">
                    {genre}
                  </span>
                ))}
              </div>
            </article>

            <aside id="avaliacoes" className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold">Avaliações dos leitores</h3>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl font-bold">{book.rating.toFixed(1)}</span>
                <div>
                  <StarRating rating={book.rating} />
                  <p className="mt-1 text-[10px] text-slate-400">Com base em {book.reviewCount} avaliações</p>
                </div>
              </div>
              <div className="mt-4 space-y-2" aria-label="Distribuição de avaliações">
                {[5, 4, 3, 2, 1].map((stars, index) => (
                  <div key={stars} className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="w-2">{stars}</span>
                    <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: `${[84, 58, 32, 18, 8][index]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </aside>
            <div className="md:col-span-2">
              <ReviewForm onSubmit={({ rating }) => setUserRating(rating)} />
            </div>
          </div>
        </section>

        <section id="sugestoes" className="border-t border-slate-100 bg-slate-50/70">
          <div className="mx-auto max-w-6xl px-5 py-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-base font-bold">Você também pode gostar</h2>
                <p className="mt-1 text-[11px] text-slate-500">Livros que podem combinar com a sua próxima leitura.</p>
              </div>
              <a href="#sugestoes" className="shrink-0 text-[10px] font-semibold text-violet-700 hover:underline">
                Ver catálogo →
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {suggestions.map((suggestion) => (
                <article key={suggestion.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <BookCover
                    src={suggestion.cover}
                    title={suggestion.title}
                    className="h-32 border-b border-slate-100 sm:h-40"
                  />
                  <div className="p-3">
                    <h3 className="truncate text-[11px] font-bold">{suggestion.title}</h3>
                    <p className="mt-0.5 truncate text-[10px] text-slate-500">{suggestion.author}</p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      <span className="text-amber-400" aria-hidden="true">★</span> {suggestion.rating.toFixed(1)}
                    </p>
                    <Link
                      to={`/livros/${suggestion.id}`}
                      className="mt-2 block w-full rounded-md bg-violet-700 px-2 py-1.5 text-center text-[10px] font-semibold text-white hover:bg-violet-800"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
