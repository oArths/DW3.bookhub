import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react"
import { Link } from "react-router-dom";
import SearchBooks from "../../components/SearchBooks";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import type { Book } from "../../data/books";
import {
  getTrendingBooks,
  searchBooks,
  type OpenLibrarySort,
} from "../../services/api_openlibery";

interface Category {
  label: string;
  subject?: string;
}

const categories: Category[] = [
  { label: "Todos" },
  { label: "Ficção", subject: "fiction" },
  { label: "Romance", subject: "romance" },
  { label: "Sci-fi", subject: "science fiction" },
  { label: "Fantasia", subject: "fantasy" },
  { label: "Biografia", subject: "biography" },
  { label: "Autoajuda", subject: "self-help" },
];

/** Gênero carregado na primeira visita ao catálogo. */
const DEFAULT_CATEGORY = "Ficção";

const booksPerPage = 8;

function BookCard({ book }: { book: Book }) {
  const [added, setAdded] = useState(false);
  const { requireAuth } = useRequireAuth();

  function toggleAdded() {
    if (!requireAuth("Você precisa estar logado para adicionar livros à sua estante.")) return;
    setAdded((current) => !current);
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to={`/livros/${book.id}`}
        aria-label={`Ver detalhes de ${book.title}`}
        className="group flex h-28 items-center justify-center bg-slate-50 sm:h-36"
      >
        {book.cover ? (
          <img
            src={book.cover}
            alt={`Capa de ${book.title}`}
            loading="lazy"
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <span className="px-2 text-center text-[10px] text-slate-300 transition group-hover:text-violet-400">
            Capa do livro
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3 gap-1">
        <Link to={`/livros/${book.id}`} className="truncate text-[16px] font-medium text-slate-900 hover:text-violet-700">
          {book.title}
        </Link>
        <p className="mt-0.5 truncate text-[14px] text-slate-500">
          {book.author}
          {book.genres[0] ? ` · ${book.genres[0]}` : ""}
          {book.rating > 0 ? ` · ★ ${book.rating.toFixed(1)}` : ""}
        </p>
        <div className="flex flex-row items-center justify-between gap-1">
          <Link
            className={` rounded-md cursor-pointer px-2 py-1.5 text-[10px] bg-violet-700 font-semibold w-full text-center text-white transition-all hover:scale-[102%]
  `} to={`/livros/${book.id}`}>

            Ver mais
          </Link>
          <button type="button"
            onClick={toggleAdded}
            aria-pressed={added}
            className={`  p-1 border border-gray-600 rounded-md cursor-pointer transition-all hover:scale-[102%] ${added ? " bg-gray-800" : "bg-transparent"}`}>
            <Bookmark size={20} className={`${added ? "stroke-gray-100" : "stroke-gray-800"} `} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}

function BookCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm">
      <div className="h-28 animate-pulse bg-slate-100 sm:h-36" />
      <div className="space-y-2 p-3">
        <div className="h-2.5 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="h-2 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-6 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function Catalogo() {
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [sort, setSort] = useState<OpenLibrarySort>("relevance");
  const [page, setPage] = useState(1);

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const activeCategory = categories.find((item) => item.label === category) ?? categories[0];

  // Busca inicial e a cada mudança de gênero, ordenação ou página.
  useEffect(() => {
    let active = true;

    async function loadBooks() {
      setLoading(true);
      setError("");

      try {
        const subject = activeCategory.subject;

        if (subject) {
          const { books: results, total: found } = await searchBooks({
            genre: subject,
            sort,
            page,
            limit: booksPerPage,
          });
          if (!active) return;
          setBooks(results);
          setTotal(found);
        } else {
          const results = await getTrendingBooks(booksPerPage);
          if (!active) return;
          setBooks(results);
          setTotal(results.length);
        }
      } catch {
        if (!active) return;
        setBooks([]);
        setTotal(0);
        setError("Não foi possível carregar os livros agora. Tente novamente.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, [activeCategory.subject, sort, page, reloadKey]);

  const pageCount = Math.max(1, Math.ceil(total / booksPerPage));
  const firstVisiblePage = Math.max(1, Math.min(page - 2, pageCount - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, pageCount) },
    (_, index) => firstVisiblePage + index,
  );

  function selectCategory(nextCategory: string) {
    setCategory(nextCategory);
    setPage(1);
  }

  function changeSort(value: string) {
    setSort(value as OpenLibrarySort);
    setPage(1);
  }

  const showEmptyState = !loading && books.length === 0 && !error;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SiteHeader />

      <main>
        <section className="bg-gradient-to-r from-violet-800 via-violet-700 to-purple-600 text-white">
          <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">BookHub</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Explore nosso catálogo</h1>
            <p className="mt-1 max-w-xl text-xs leading-5 text-violet-100">
              Encontre sua próxima leitura entre histórias, ideias e novos mundos.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-5" aria-label="Catálogo de livros">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2" aria-label="Filtrar por categoria">
              {categories.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => selectCategory(item.label)}
                  aria-pressed={category === item.label}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${category === item.label
                    ? "bg-violet-700 text-white"
                    : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                    }`}
                >
                  {item.label}
                </button>
              ))}
              <label className="ml-auto flex items-center gap-2 text-[10px] text-slate-500">
                Ordenar por
                <select
                  value={sort}
                  onChange={(event) => changeSort(event.target.value)}
                  className="rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-700 outline-none focus:ring-2 focus:ring-violet-300"
                >
                  <option value="relevance">Mais relevantes</option>
                  <option value="rating">Melhor avaliados</option>
                  <option value="new">Mais recentes</option>
                  <option value="old">Mais antigos</option>
                  <option value="title">Título (A-Z)</option>
                </select>
              </label>
            </div>

            <div className="sm:hidden">
              <SearchBooks className="w-full" placeholder="Buscar por título, autor..." />
            </div>

            {error && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setReloadKey((current) => current + 1)}
                  className="rounded-md bg-red-700 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-red-800"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-busy={loading}>
              {loading
                ? Array.from({ length: booksPerPage }, (_, index) => <BookCardSkeleton key={index} />)
                : books.map((book) => <BookCard key={book.id} book={book} />)}
            </div>

            {showEmptyState && (
              <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                Nenhum livro encontrado. Tente outra busca ou categoria.
              </p>
            )}

            {pageCount > 1 && (
              <nav className="flex items-center justify-center gap-1 pt-1" aria-label="Paginação do catálogo">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1 || loading}
                  className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-violet-100 disabled:opacity-40"
                  aria-label="Página anterior"
                >
                  ‹
                </button>
                {visiblePages.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    disabled={loading}
                    aria-current={page === pageNumber ? "page" : undefined}
                    className={`min-w-7 rounded px-2 py-1 text-[10px] font-semibold disabled:opacity-40 ${page === pageNumber ? "bg-violet-700 text-white" : "text-slate-500 hover:bg-violet-100"
                      }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  disabled={page === pageCount || loading}
                  className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-violet-100 disabled:opacity-40"
                  aria-label="Próxima página"
                >
                  ›
                </button>
              </nav>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
