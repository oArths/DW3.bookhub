import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Book } from "../data/books";
import { searchBooks } from "../services/api_openlibery";

interface SearchBooksProps {
  /** Classes aplicadas ao container (o input ocupa 100% da largura). */
  className?: string;
  placeholder?: string;
}

const MIN_TERM_LENGTH = 2;
const RESULT_LIMIT = 6;

/**
 * Campo de busca com lista suspensa de resultados.
 * Não filtra o catálogo: apenas sugere livros e navega direto para o selecionado.
 */
export default function SearchBooks({
  className = "",
  placeholder = "Buscar livros, autores...",
}: SearchBooksProps) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Consulta a API enquanto o usuário digita (com debounce).
  useEffect(() => {
    const value = term.trim();
    let active = true;

    const timeout = setTimeout(async () => {
      if (value.length < MIN_TERM_LENGTH) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { books } = await searchBooks({ query: value, limit: RESULT_LIMIT });
        if (!active) return;
        setResults(books);
        setOpen(true);
      } catch {
        if (!active) return;
        setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [term]);

  // Fecha a lista ao clicar fora.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function close() {
    setOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = results[0];
    if (!first) return;

    setTerm("");
    close();
    navigate(`/livros/${first.id}`);
  }

  const showDropdown = open && term.trim().length >= MIN_TERM_LENGTH;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form role="search" onSubmit={handleSubmit}>
        <label>
          <span className="sr-only">Pesquisar livros</span>
          <input
            type="search"
            value={term}
            placeholder={placeholder}
            onChange={(event) => setTerm(event.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            onKeyDown={(event) => event.key === "Escape" && close()}
            className="w-full rounded-full bg-slate-100 px-4 py-2 text-xs outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-violet-300"
          />
        </label>
      </form>

      {showDropdown && (
        <div className="absolute right-0 z-30 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {loading ? (
            <ul className="divide-y divide-slate-100" aria-label="Carregando resultados">
              {Array.from({ length: 3 }, (_, index) => (
                <li key={index} className="flex items-center gap-3 p-3">
                  <div className="h-12 w-9 shrink-0 animate-pulse rounded bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                    <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-100" />
                  </div>
                </li>
              ))}
            </ul>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-slate-500">
              Nenhum livro encontrado para “{term.trim()}”.
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {results.map((book) => (
                <li key={book.id}>
                  <Link
                    to={`/livros/${book.id}`}
                    onClick={close}
                    className="flex items-center gap-3 p-3 transition hover:bg-violet-50"
                  >
                    <span className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-50">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[8px] text-slate-300">—</span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-slate-900">
                        {book.title}
                      </span>
                      <span className="block truncate text-[10px] text-slate-500">{book.author}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
