import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

type ReadingStatus = "Quero ler" | "Lendo" | "Lido";
type StatusFilter = "Todos" | ReadingStatus;

interface CollectionBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
  rating: number | null;
  notes: string;
  cover: string;
  addedAt: number;
}

interface BookFormValues {
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
  rating: string;
  notes: string;
  cover: string;
}

const storageKey = "bookhub.collection.v1";
const filters: StatusFilter[] = ["Todos", "Quero ler", "Lendo", "Lido"];

const sampleBooks: CollectionBook[] = [
  {
    id: "sample-1984",
    title: "1984",
    author: "George Orwell",
    genre: "Ficção distópica",
    status: "Quero ler",
    rating: null,
    notes: "",
    cover: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    addedAt: 6,
  },
  {
    id: "sample-hora-da-estrela",
    title: "A hora da estrela",
    author: "Clarice Lispector",
    genre: "Romance",
    status: "Lido",
    rating: 5,
    notes: "",
    cover: "https://covers.openlibrary.org/b/isbn/9788520925688-L.jpg",
    addedAt: 5,
  },
  {
    id: "sample-dom-casmurro",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: "Romance",
    status: "Lido",
    rating: 5,
    notes: "",
    cover: "https://covers.openlibrary.org/b/isbn/9788594318241-L.jpg",
    addedAt: 4,
  },
  {
    id: "sample-pequeno-principe",
    title: "O pequeno príncipe",
    author: "Antoine de Saint-Exupéry",
    genre: "Fábula",
    status: "Lido",
    rating: 4,
    notes: "",
    cover: "https://covers.openlibrary.org/b/isbn/9788535902778-L.jpg",
    addedAt: 3,
  },
  {
    id: "sample-quarto-de-despejo",
    title: "Quarto de despejo",
    author: "Carolina Maria de Jesus",
    genre: "Diário",
    status: "Quero ler",
    rating: null,
    notes: "",
    cover: "https://covers.openlibrary.org/b/isbn/9788508171279-L.jpg",
    addedAt: 2,
  },
  {
    id: "sample-torto-arado",
    title: "Torto arado",
    author: "Itamar Vieira Junior",
    genre: "Romance",
    status: "Quero ler",
    rating: null,
    notes: "",
    cover: "https://covers.openlibrary.org/b/isbn/9786580309313-L.jpg",
    addedAt: 1,
  },
];

const emptyForm: BookFormValues = {
  title: "",
  author: "",
  genre: "",
  status: "Quero ler",
  rating: "",
  notes: "",
  cover: "",
};

function readCollection(): CollectionBook[] {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === null) return sampleBooks;
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed as CollectionBook[] : sampleBooks;
  } catch {
    return sampleBooks;
  }
}

function BookForm({
  initialValues,
  onCancel,
  onSave,
}: {
  initialValues: BookFormValues;
  onCancel: () => void;
  onSave: (values: BookFormValues) => void;
}) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");

  function update<K extends keyof BookFormValues>(key: K, value: BookFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.title.trim() || !values.author.trim()) {
      setError("Preencha o título e o autor.");
      return;
    }
    onSave(values);
  }

  const fieldClass = "mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-xs font-semibold text-slate-700">
        Título *
        <input autoFocus value={values.title} onChange={(event) => update("title", event.target.value)} className={fieldClass} maxLength={120} />
      </label>
      <label className="block text-xs font-semibold text-slate-700">
        Autor *
        <input value={values.author} onChange={(event) => update("author", event.target.value)} className={fieldClass} maxLength={100} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-semibold text-slate-700">
          Gênero
          <input value={values.genre} onChange={(event) => update("genre", event.target.value)} className={fieldClass} maxLength={60} />
        </label>
        <label className="block text-xs font-semibold text-slate-700">
          Status
          <select value={values.status} onChange={(event) => update("status", event.target.value as ReadingStatus)} className={fieldClass}>
            <option>Quero ler</option>
            <option>Lendo</option>
            <option>Lido</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-semibold text-slate-700">
          Nota pessoal
          <select value={values.rating} onChange={(event) => update("rating", event.target.value)} className={fieldClass}>
            <option value="">Sem avaliação</option>
            {[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} de 5</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-slate-700">
          URL da capa
          <input type="url" value={values.cover} onChange={(event) => update("cover", event.target.value)} className={fieldClass} placeholder="https://..." />
        </label>
      </div>
      <label className="block text-xs font-semibold text-slate-700">
        Observações
        <textarea value={values.notes} onChange={(event) => update("notes", event.target.value)} className={`${fieldClass} resize-y`} rows={3} maxLength={500} />
      </label>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
        <button type="submit" className="rounded-md bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800">Salvar livro</button>
      </div>
    </form>
  );
}

export default function Colecao() {
  const [books, setBooks] = useState<CollectionBook[]>(readCollection);
  const [filter, setFilter] = useState<StatusFilter>("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
  const [editing, setEditing] = useState<CollectionBook | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CollectionBook | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(books));
  }, [books]);

  const visibleBooks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return books
      .filter((book) => filter === "Todos" || book.status === filter)
      .filter((book) => !query || `${book.title} ${book.author}`.toLocaleLowerCase("pt-BR").includes(query))
      .sort((left, right) => {
        if (sort === "author") return left.author.localeCompare(right.author, "pt-BR");
        if (sort === "date") return right.addedAt - left.addedAt;
        return left.title.localeCompare(right.title, "pt-BR");
      });
  }, [books, filter, search, sort]);

  function saveBook(values: BookFormValues) {
    if (editing) {
      setBooks((current) => current.map((book) => book.id === editing.id ? {
        ...book,
        title: values.title.trim(),
        author: values.author.trim(),
        genre: values.genre.trim() || "Sem gênero",
        status: values.status,
        rating: values.rating ? Number(values.rating) : null,
        notes: values.notes.trim(),
        cover: values.cover.trim(),
      } : book));
      setEditing(null);
      setNotice("Livro atualizado na coleção.");
    } else {
      setBooks((current) => [{
        id: crypto.randomUUID(),
        title: values.title.trim(),
        author: values.author.trim(),
        genre: values.genre.trim() || "Sem gênero",
        status: values.status,
        rating: values.rating ? Number(values.rating) : null,
        notes: values.notes.trim(),
        cover: values.cover.trim(),
        addedAt: Date.now(),
      }, ...current]);
      setAdding(false);
      setNotice("Livro adicionado à coleção.");
    }
    window.setTimeout(() => setNotice(""), 2800);
  }

  function formValues(book: CollectionBook): BookFormValues {
    return {
      title: book.title,
      author: book.author,
      genre: book.genre,
      status: book.status,
      rating: book.rating ? String(book.rating) : "",
      notes: book.notes,
      cover: book.cover,
    };
  }

  const hasActiveSearch = Boolean(search.trim()) || filter !== "Todos";

  return (
    <div className="min-h-screen bg-[#f7f7fb] font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-5">
          <Link to="/catalogo" className="flex items-center gap-2 text-base font-extrabold text-violet-700"><span aria-hidden="true"></span>BookHub</Link>
          <nav className="flex items-center gap-2 text-[11px] text-slate-500 sm:gap-5" aria-label="Navegação principal">
            <Link to="/catalogo" className="hover:text-violet-700">Início</Link>
            <Link to="/catalogo" className="hover:text-violet-700">Catálogo</Link>
            <Link to="/colecao" aria-current="page" className="border-b-2 border-violet-600 py-5 font-semibold text-violet-700">Minha coleção</Link>
            <Link to="/" className="hidden hover:text-violet-700 sm:block">Comunidade</Link>
          </nav>
          <button type="button" aria-label="Perfil de Lucas Oliveira" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">LO</button>
        </div>
      </header>

      <main className="mx-auto min-h-[calc(100vh-126px)] max-w-6xl px-5 py-5 sm:py-7">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Minha coleção</h1>
            <p className="mt-0.5 text-[10px] text-slate-500">{books.length} {books.length === 1 ? "livro na sua coleção" : "livros na sua coleção"}</p>
          </div>
          <button type="button" onClick={() => setAdding(true)} className="rounded-md bg-violet-700 px-3 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-violet-800">＋ Adicionar livro</button>
        </div>

        <label className="block">
          <span className="sr-only">Buscar por título ou autor</span>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título ou autor" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por status">
            {filters.map((option) => (
              <button key={option} type="button" onClick={() => setFilter(option)} aria-pressed={filter === option} className={`rounded border px-2.5 py-1.5 text-[10px] font-medium transition ${filter === option ? "border-violet-600 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"}`}>
                {option}{option === "Todos" ? ` ${books.length}` : ` ${books.filter((book) => book.status === option).length}`}
              </button>
            ))}
          </div>
          <label className="ml-auto flex items-center gap-2 text-[10px] text-slate-500">
            <span className="hidden sm:inline">Ordenar:</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar coleção" className="rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-700 outline-none focus:ring-2 focus:ring-violet-200">
              <option value="title">Título</option>
              <option value="author">Autor</option>
              <option value="date">Data de adição</option>
            </select>
          </label>
        </div>

        <p className="my-3 text-[10px] text-slate-500" aria-live="polite">{visibleBooks.length} livros • {filter === "Todos" ? "Todos os status" : filter}</p>

        {visibleBooks.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBooks.map((book) => (
              <article key={book.id} className="relative flex min-h-28 gap-3 rounded-md border border-slate-200 bg-white p-2.5 shadow-sm">
                <div aria-label={`Capa de ${book.title}`} className="grid h-24 w-[72px] shrink-0 place-items-center overflow-hidden rounded-sm bg-slate-100">
                  {book.cover ? <img src={book.cover} alt={`Capa de ${book.title}`} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <span aria-hidden="true" className="text-2xl text-violet-300">▤</span>}
                </div>
                <div className="min-w-0 flex-1 py-1">
                  <h2 className="truncate text-xs font-bold text-slate-800">{book.title}</h2>
                  <p className="mt-0.5 truncate text-[10px] text-slate-500">{book.author}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[9px]">
                    <span className={book.status === "Lido" ? "font-semibold text-emerald-700" : book.status === "Lendo" ? "font-semibold text-amber-700" : "font-semibold text-violet-700"}>{book.status}</span>
                    <span className="text-slate-400">{book.rating ? `★ ${book.rating},0` : "Sem avaliação"}</span>
                  </div>
                  {book.notes && <p className="mt-1 line-clamp-2 text-[9px] text-slate-500">{book.notes}</p>}
                  <p className="mt-1 text-[9px] text-slate-400">{book.genre}</p>
                </div>
                <div className="relative self-end">
                  <button type="button" aria-label={`Ações para ${book.title}`} aria-expanded={openMenu === book.id} onClick={() => setOpenMenu((current) => current === book.id ? null : book.id)} className="grid h-7 w-7 place-items-center rounded text-lg leading-none text-violet-700 hover:bg-violet-50">⋯</button>
                  {openMenu === book.id && (
                    <div className="absolute bottom-8 right-0 z-10 w-32 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                      <button type="button" onClick={() => { setEditing(book); setOpenMenu(null); }} className="w-full rounded px-2 py-1.5 text-left text-[10px] text-slate-700 hover:bg-slate-50">Editar</button>
                      <button type="button" onClick={() => { setDeleteTarget(book); setOpenMenu(null); }} className="w-full rounded px-2 py-1.5 text-left text-[10px] text-red-600 hover:bg-red-50">Remover</button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="grid min-h-[300px] place-items-center rounded-md border border-slate-200 bg-white px-5 py-12 text-center" aria-label="Coleção vazia">
            <div>
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-violet-100 text-lg text-violet-700" aria-hidden="true">⌕</span>
              <h2 className="mt-3 text-sm font-bold">{hasActiveSearch ? "Nenhum livro encontrado" : "Sua próxima leitura começa aqui"}</h2>
              <p className="mt-1 text-[10px] text-slate-500">{hasActiveSearch ? "Não encontramos livros com esses critérios." : "Adicione seu primeiro livro à coleção."}</p>
              {hasActiveSearch ? (
                <button type="button" onClick={() => { setSearch(""); setFilter("Todos"); }} className="mt-3 rounded-md border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50">Limpar busca</button>
              ) : (
                <button type="button" onClick={() => setAdding(true)} className="mt-3 rounded-md bg-violet-700 px-3 py-2 text-[10px] font-semibold text-white hover:bg-violet-800">＋ Adicionar livro</button>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl justify-between px-5 py-3 text-[9px] text-slate-400"><span>© 2026 BookHub</span><a href="mailto:suporte@bookhub.com" className="hover:text-violet-700">Ajuda e suporte</a></div>
      </footer>

      {(adding || editing || deleteTarget) && (
        <div className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) { setAdding(false); setEditing(null); setDeleteTarget(null); } }}>
          {deleteTarget ? (
            <section role="dialog" aria-modal="true" aria-labelledby="remove-title" className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
              <h2 id="remove-title" className="text-base font-bold">Remover livro?</h2>
              <p className="mt-2 text-sm text-slate-600">“{deleteTarget.title}” será removido da sua coleção.</p>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">Cancelar</button>
                <button type="button" onClick={() => { setBooks((current) => current.filter((book) => book.id !== deleteTarget.id)); setDeleteTarget(null); setNotice("Livro removido da coleção."); window.setTimeout(() => setNotice(""), 2800); }} className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Remover</button>
              </div>
            </section>
          ) : (
            <section role="dialog" aria-modal="true" aria-labelledby="form-title" className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div><h2 id="form-title" className="text-base font-bold">{editing ? "Editar livro" : "Adicionar livro"}</h2><p className="mt-1 text-xs text-slate-500">Os campos com * são obrigatórios.</p></div>
                <button type="button" aria-label="Fechar" onClick={() => { setAdding(false); setEditing(null); }} className="rounded px-2 py-1 text-lg leading-none text-slate-500 hover:bg-slate-100">×</button>
              </div>
              <BookForm key={editing?.id ?? "new-book"} initialValues={editing ? formValues(editing) : emptyForm} onCancel={() => { setAdding(false); setEditing(null); }} onSave={saveBook} />
            </section>
          )}
        </div>
      )}

      {notice && <div role="status" className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg">{notice}</div>}
    </div>
  );
}