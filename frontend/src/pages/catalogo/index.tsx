import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bookCatalog, type Book } from "../../data/books";

const categories = ["Todos", "Ficção", "Romance", "Sci-fi", "Fantasia", "Biografia", "Autoajuda"];
const booksPerPage = 8;

function CatalogHeader({ search, onSearchChange }: { search: string; onSearchChange: (value: string) => void }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/catalogo" className="text-lg font-extrabold tracking-tight text-violet-700">
          BookHub
        </Link>
        <nav className="hidden items-center gap-5 text-xs text-slate-500 sm:flex" aria-label="Navegação principal">
          <Link to="/" className="hover:text-violet-700">Início</Link>
          <Link to="/catalogo" className="font-semibold text-violet-700">Catálogo</Link>
          <Link to="/" className="hover:text-violet-700">Minha Estante</Link>
          <Link to="/" className="hover:text-violet-700">Comunidade</Link>
        </nav>
        <label className="hidden sm:block">
          <span className="sr-only">Pesquisar livros no catálogo</span>
          <input
            type="search"
            value={search}
            placeholder="Buscar livros, autores..."
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-48 rounded-full bg-slate-100 px-4 py-2 text-xs outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-violet-300"
          />
        </label>
        <Link to="/" className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100">
          Entrar
        </Link>
      </div>
    </header>
  );
}

function BookCard({ book }: { book: Book }) {
  const [added, setAdded] = useState(false);

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to={`/livros/${book.id}`}
        aria-label={`Ver detalhes de ${book.title}`}
        className="group flex h-28 items-center justify-center bg-slate-50 sm:h-36"
      >
        {book.cover ? (
          <img src={book.cover} alt={`Capa de ${book.title}`} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[10px] text-slate-300 transition group-hover:text-violet-400">Capa do livro</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link to={`/livros/${book.id}`} className="truncate text-[11px] font-bold text-slate-900 hover:text-violet-700">
          {book.title}
        </Link>
        <p className="mt-0.5 truncate text-[9px] text-slate-500">
          {book.author} · {book.genres[0]} · ★ {book.rating.toFixed(1)}
        </p>
        <button
          type="button"
          onClick={() => setAdded((current) => !current)}
          aria-pressed={added}
          className={`mt-2 rounded-md px-2 py-1.5 text-[10px] font-semibold text-white transition ${
            added ? "bg-emerald-600 hover:bg-emerald-700" : "bg-violet-700 hover:bg-violet-800"
          }`}
        >
          {added ? "Adicionado à estante" : "Adicionar à estante"}
        </button>
      </div>
    </article>
  );
}

function CatalogFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-7 sm:grid-cols-3">
        <div>
          <h2 className="text-xs font-bold text-white">BookHub</h2>
          <p className="mt-2 max-w-xs text-[10px] leading-4 text-slate-400">
            Descubra livros, compartilhe resenhas e encontre sua próxima leitura.
          </p>
        </div>
        <div>
          <h3 className="text-[10px] font-semibold text-white">Plataforma</h3>
          <p className="mt-2 text-[10px] text-slate-400">Explore o catálogo e conheça novos livros.</p>
        </div>
        <div>
          <h3 className="text-[10px] font-semibold text-white">Suporte</h3>
          <a href="mailto:suporte@bookhub.com" className="mt-2 block text-[10px] text-slate-400 hover:text-white">
            Fale conosco
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-slate-800 px-5 py-3 text-[9px] text-slate-500">
        © 2025 BookHub. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default function Catalogo() {
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("popular");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  const filteredBooks = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
    const results = bookCatalog.filter((book) => {
      const matchesCategory = category === "Todos" || book.genres.includes(category);
      const matchesSearch =
        !normalizedSearch ||
        `${book.title} ${book.author} ${book.genres.join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });

    return [...results].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title, "pt-BR");
      if (sort === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [category, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
  const visibleBooks = filteredBooks.slice((page - 1) * booksPerPage, page * booksPerPage);

  function selectCategory(nextCategory: string) {
    setCategory(nextCategory);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <CatalogHeader search={search} onSearchChange={updateSearch} />

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
                  key={item}
                  type="button"
                  onClick={() => selectCategory(item)}
                  aria-pressed={category === item}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${
                    category === item
                      ? "bg-violet-700 text-white"
                      : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                  }`}
                >
                  {item}
                </button>
              ))}
              <label className="ml-auto flex items-center gap-2 text-[10px] text-slate-500">
                Ordenar por
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-700 outline-none focus:ring-2 focus:ring-violet-300"
                >
                  <option value="popular">Mais populares</option>
                  <option value="rating">Melhor avaliados</option>
                  <option value="title">Título</option>
                </select>
              </label>
            </div>

            <label className="sm:hidden">
              <span className="sr-only">Pesquisar livros</span>
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por título, autor ou gênero..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-300"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleBooks.map((book) => <BookCard key={book.id} book={book} />)}
            </div>

            {visibleBooks.length === 0 && (
              <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                Nenhum livro encontrado. Tente outra busca ou categoria.
              </p>
            )}

            {pageCount > 1 && (
              <nav className="flex items-center justify-center gap-1 pt-1" aria-label="Paginação do catálogo">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-violet-100 disabled:opacity-40"
                  aria-label="Página anterior"
                >
                  ‹
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={page === pageNumber ? "page" : undefined}
                    className={`min-w-7 rounded px-2 py-1 text-[10px] font-semibold ${
                      page === pageNumber ? "bg-violet-700 text-white" : "text-slate-500 hover:bg-violet-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  disabled={page === pageCount}
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
      <CatalogFooter />
    </div>
  );
}
