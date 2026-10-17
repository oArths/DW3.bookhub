import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Book } from "../../data/books";
import { getBookById, getSuggestions } from "../../services/api_openlibery";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
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
        <img src={src} alt={`Capa de ${title}`} className="h-full w-full object-contain p-2" />
      ) : (
        <div className="h-[78%] w-[72%] rounded-sm border border-slate-200 bg-white shadow-sm" />
      )}
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <SiteHeader />
      <main aria-busy="true">
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-5 pb-7 pt-4">
            <div className="mb-5 h-3 w-40 animate-pulse rounded bg-slate-100" />
            <div className="grid gap-6 md:grid-cols-[minmax(220px,280px)_1fr]">
              <div>
                <div className="rounded-xl bg-violet-50 p-3">
                  <div className="h-52 animate-pulse rounded-md bg-violet-100 sm:h-64" />
                  <div className="mx-auto mt-2 h-2 w-24 animate-pulse rounded bg-violet-100" />
                </div>
                <div className="mt-3 h-14 animate-pulse rounded-lg bg-slate-100" />
              </div>
              <div className="min-w-0">
                <div className="mb-2 flex gap-2">
                  <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
                  <div className="h-5 w-16 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="mt-4 h-28 animate-pulse rounded-xl bg-slate-100" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-slate-50/70">
          <div className="mx-auto max-w-6xl px-5 py-8">
            <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="h-32 animate-pulse bg-slate-100 sm:h-40" />
                  <div className="space-y-2 p-3">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                    <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-100" />
                    <div className="mt-2 h-6 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function LivroDetalhes({
  book: providedBook,
  suggestions: providedSuggestions,
}: BookDetailsProps) {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(providedBook ?? null);
  const [suggestions, setSuggestions] = useState<Book[]>(providedSuggestions ?? []);
  const [loading, setLoading] = useState(!providedBook && Boolean(id));
  const [error, setError] = useState("");
  const [wantsToRead, setWantsToRead] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const { requireAuth } = useRequireAuth();

  const missingId = !providedBook && !id;

  useEffect(() => {
    if (providedBook || !id) return;

    let active = true;

    (async () => {
      setLoading(true);
      setError("");
      setSuggestions([]);

      try {
        const data = await getBookById(id);
        if (!active) return;
        setBook(data);

        try {
          const related = await getSuggestions(data.genres[0], data.id, 4);
          if (active) setSuggestions(related);
        } catch {
          // As sugestões são opcionais e não impedem a página de carregar.
        }
      } catch {
        if (active) setError("Não foi possível carregar os detalhes deste livro.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id, providedBook]);

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || missingId || !book) {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-5 py-10">
          <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500" role="alert">
            {error || (missingId ? "Livro não encontrado." : "Não foi possível exibir este livro.")}
          </p>
          <div className="mt-4 text-center">
            <Link to="/catalogo" className="text-xs font-semibold text-violet-700 hover:underline">
              Voltar ao catálogo
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const details: [string, string][] = [
    ["Editora", book.publisher],
    ["Publicação", book.publicationDate],
    ["Idioma", book.language],
    ["Páginas", book.pages > 0 ? String(book.pages) : "Não informado"],
    ["ISBN", book.isbn],
    ["Categorias", book.genres.length ? book.genres.join(", ") : "Não informado"],
  ];

  function toggleWantsToRead() {
    if (!requireAuth("Você precisa estar logado para adicionar livros à sua estante.")) return;
    setWantsToRead((current) => !current);
  }

  function toggleHasRead() {
    if (!requireAuth("Você precisa estar logado para marcar um livro como lido.")) return;
    setHasRead((current) => !current);
  }

  function toggleSaved() {
    if (!requireAuth("Você precisa estar logado para salvar livros.")) return;
    setSaved((current) => !current);
  }

  return (
    <div id="topo" className="min-h-screen bg-white font-sans text-slate-900">
      <SiteHeader />

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
                    {book.availableOnline ? (
                      <>
                        <p className="text-xs font-semibold">Disponível online</p>
                        {book.archiveId ? (
                          <a
                            href={`https://archive.org/details/${book.archiveId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-violet-700 hover:underline"
                          >
                            Ler ou emprestar no Archive.org
                          </a>
                        ) : (
                          <p className="text-[10px] text-slate-400">Leitores também estão lendo</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold">Disponível na estante</p>
                        <p className="text-[10px] text-slate-400">Leitores também estão lendo</p>
                      </>
                    )}
                    {book.openLibraryUrl && (
                      <a
                        href={book.openLibraryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 block text-[10px] text-slate-400 hover:text-violet-700"
                      >
                        Ver na Open Library ↗
                      </a>
                    )}
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
                  {book.rating > 0 ? (
                    <StarRating rating={book.rating} showValue />
                  ) : (
                    <span>Sem avaliações ainda</span>
                  )}
                  <span>
                    {book.reviewCount > 0 ? `${book.reviewCount} avaliações` : "Ainda sem avaliações publicadas"}
                  </span>
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
                    {details.map(([label, value]) => (
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
                    onClick={toggleWantsToRead}
                    aria-pressed={wantsToRead}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition ${
                      wantsToRead ? "bg-emerald-600 hover:bg-emerald-700" : "bg-violet-700 hover:bg-violet-800"
                    }`}
                  >
                    {wantsToRead ? "Adicionado à estante" : "Adicionar à estante"}
                  </button>
                  <button
                    type="button"
                    onClick={toggleHasRead}
                    aria-pressed={hasRead}
                    className="rounded-lg border border-violet-300 px-4 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-50"
                  >
                    {hasRead ? "Marcar como não lido" : "Marcar como lido"}
                  </button>
                  <button
                    type="button"
                    onClick={toggleSaved}
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
                <span className="text-3xl font-bold">{book.rating > 0 ? book.rating.toFixed(1) : "—"}</span>
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
              <ReviewForm
                onSubmit={({ rating }) => {
                  if (!requireAuth("Você precisa estar logado para avaliar um livro.")) return false;
                  setUserRating(rating);
                }}
              />
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
                      <span className="text-amber-400" aria-hidden="true">★</span>{" "}
                      {suggestion.rating > 0 ? suggestion.rating.toFixed(1) : "—"}
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

      <SiteFooter />
    </div>
  );
}
