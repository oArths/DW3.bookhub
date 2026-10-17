import axios from "axios";
import type { Book } from "../data/books";

/** Base URL da API pública da Open Library. */
const OPEN_LIBRARY_URL = "https://openlibrary.org";
/** Base URL das capas servidas pela Open Library. */
const OPEN_LIBRARY_COVERS_URL = "https://covers.openlibrary.org/b/id";

export const apiOpenLibrary = axios.create({
  baseURL: OPEN_LIBRARY_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Campos do Solr solicitados em /search.json.
 * Devem ser poucos: pedir "*" retorna uma resposta cara.
 */
const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "cover_i",
  "first_publish_year",
  "first_sentence",
  "publisher",
  "language",
  "number_of_pages_median",
  "isbn",
  "subject",
  "ratings_average",
  "ratings_count",
  "edition_count",
  "ia",
  "ebook_access",
].join(",");

/** Campos aceitos pelo endpoint de destaques (/trending/daily.json). */
const TRENDING_FIELDS = [
  "key",
  "title",
  "author_name",
  "cover_i",
  "first_publish_year",
  "ratings_average",
  "ratings_count",
  "subject",
].join(",");

/** Documento retornado em `docs` pela busca da Open Library. */
export interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  first_sentence?: string[];
  publisher?: string[];
  language?: string[];
  number_of_pages_median?: number;
  isbn?: string[];
  subject?: string[];
  ratings_average?: number;
  ratings_count?: number;
  edition_count?: number;
  ia?: string[];
  ebook_access?: string;
}

interface OpenLibrarySearchResponse {
  numFound?: number;
  docs?: OpenLibraryDoc[];
}

interface OpenLibraryTrendingResponse {
  works?: OpenLibraryDoc[];
}

interface OpenLibraryWork {
  title?: string;
  description?: string | { value?: string };
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
}

/** Valores de ordenação aceitos pelo parâmetro `sort` da busca. */
export type OpenLibrarySort = "relevance" | "new" | "old" | "random" | "rating" | "title";

export interface SearchBooksParams {
  /** Termo livre digitado pelo usuário (título, autor, etc). */
  query?: string;
  /** Gênero/assunto traduzido para o campo `subject` do Solr. */
  genre?: string;
  sort?: OpenLibrarySort;
  page?: number;
  limit?: number;
}

export interface SearchBooksResult {
  books: Book[];
  total: number;
}

const LANGUAGE_LABELS: Record<string, string> = {
  eng: "Inglês",
  por: "Português",
  spa: "Espanhol",
  fre: "Francês",
  fra: "Francês",
  ger: "Alemão",
  deu: "Alemão",
  ita: "Italiano",
  jpn: "Japonês",
  rus: "Russo",
  chi: "Chinês",
  zho: "Chinês",
  dut: "Holandês",
  nld: "Holandês",
  pol: "Polonês",
  mul: "Múltiplos idiomas",
  und: "Não determinado",
};

function formatLanguages(codes?: string[]): string {
  if (!codes?.length) return "Não informado";
  const unique = [...new Set(codes)];
  return unique
    .slice(0, 3)
    .map((code) => LANGUAGE_LABELS[code.toLowerCase()] ?? code.toUpperCase())
    .join(", ");
}

/** Remove assuntos vazios/duplicados e limita a quantidade exibida. */
function normalizeSubjects(subjects?: string[]): string[] {
  if (!subjects?.length) return [];
  return [...new Set(subjects.filter(Boolean))].slice(0, 4);
}

function extractDescription(description?: OpenLibraryWork["description"]): string | undefined {
  if (!description) return undefined;
  if (typeof description === "string") return description;
  return description.value;
}

/** Monta a URL de uma capa a partir do `cover_i` do documento. */
export function getCoverUrl(coverId?: number, size: "S" | "M" | "L" = "M"): string | undefined {
  return coverId ? `${OPEN_LIBRARY_COVERS_URL}/${coverId}-${size}.jpg` : undefined;
}

/** Monta a consulta Solr combinando termo livre e gênero (subject). */
export function buildSearchQuery(query?: string, genre?: string): string {
  const parts: string[] = [];
  const term = query?.trim();
  const subject = genre?.trim();

  if (term) parts.push(term);
  if (subject && !(term?.toLowerCase() ?? "").includes("subject:")) parts.push(`subject:${subject}`);

  // A Open Library rejeita buscas vazias, então usamos um assunto genérico.
  return parts.join(" ") || "subject:fiction";
}

function isAvailableOnline(doc: OpenLibraryDoc): boolean {
  if (doc.ia?.length) return true;
  return doc.ebook_access === "public" || doc.ebook_access === "borrowable";
}

/** Converte um documento do Solr no modelo `Book` usado pelos componentes. */
export function mapDocToBook(doc: OpenLibraryDoc): Book {
  const workId = (doc.key ?? "").replace("/works/", "");

  return {
    id: workId,
    title: doc.title ?? "Título desconhecido",
    author: doc.author_name?.slice(0, 2).join(", ") || "Autor desconhecido",
    cover: getCoverUrl(doc.cover_i),
    rating: doc.ratings_average ?? 0,
    reviewCount: doc.ratings_count ?? doc.edition_count ?? 0,
    description:
      doc.first_sentence?.[0] ??
      `Obra de ${doc.author_name?.[0] ?? "autor desconhecido"} disponível no acervo da Open Library.`,
    publisher: doc.publisher?.[0] ?? "Não informado",
    publicationDate: doc.first_publish_year ? String(doc.first_publish_year) : "Não informado",
    isbn: doc.isbn?.[0] ?? "Não informado",
    pages: doc.number_of_pages_median ?? 0,
    language: formatLanguages(doc.language),
    genres: normalizeSubjects(doc.subject),
    editionCount: doc.edition_count,
    availableOnline: isAvailableOnline(doc),
    archiveId: doc.ia?.[0],
    openLibraryUrl: workId ? `${OPEN_LIBRARY_URL}/works/${workId}` : undefined,
  };
}

function mapWorkToBook(work: OpenLibraryWork, workId: string): Book {
  const coverId = work.covers?.find((cover) => cover > 0);

  return {
    id: workId,
    title: work.title ?? "Título desconhecido",
    author: "Autor desconhecido",
    cover: getCoverUrl(coverId),
    rating: 0,
    reviewCount: 0,
    description: extractDescription(work.description) ?? "Descrição não disponível.",
    publisher: "Não informado",
    publicationDate: work.first_publish_date ?? "Não informado",
    isbn: "Não informado",
    pages: 0,
    language: "Não informado",
    genres: normalizeSubjects(work.subjects),
    openLibraryUrl: `${OPEN_LIBRARY_URL}/works/${workId}`,
  };
}

/** Busca livros em /search.json respeitando gênero, termo, ordenação e paginação. */
export async function searchBooks({
  query,
  genre,
  sort = "relevance",
  page = 1,
  limit = 8,
}: SearchBooksParams): Promise<SearchBooksResult> {
  const { data } = await apiOpenLibrary.get<OpenLibrarySearchResponse>("/search.json", {
    params: {
      q: buildSearchQuery(query, genre),
      fields: SEARCH_FIELDS,
      page,
      limit,
      // A ordenação padrão já é por relevância.
      sort: sort === "relevance" ? undefined : sort,
    },
  });

  return {
    books: (data.docs ?? []).map(mapDocToBook),
    total: data.numFound ?? 0,
  };
}

/** Livros em destaque, usados na visão inicial "Todos". */
export async function getTrendingBooks(limit = 8): Promise<Book[]> {
  const { data } = await apiOpenLibrary.get<OpenLibraryTrendingResponse>("/trending/daily.json", {
    params: { limit, fields: TRENDING_FIELDS },
  });

  return (data.works ?? []).map(mapDocToBook);
}

/** Busca os dados de um livro pelo seu id de obra (ex.: "OL45804W"). */
export async function getBookById(workId: string): Promise<Book> {
  const cleanId = workId.replace(/^\/?works\//, "");
  const workKey = `/works/${cleanId}`;

  const [search, work] = await Promise.allSettled([
    apiOpenLibrary.get<OpenLibrarySearchResponse>("/search.json", {
      params: { q: `key:${workKey}`, fields: SEARCH_FIELDS, limit: 1 },
    }),
    apiOpenLibrary.get<OpenLibraryWork>(`${workKey}.json`),
  ]);

  const doc = search.status === "fulfilled" ? search.value.data.docs?.[0] : undefined;
  const workData = work.status === "fulfilled" ? work.value.data : undefined;

  if (!doc && !workData) {
    throw new Error("Livro não encontrado na Open Library.");
  }

  const book = doc ? mapDocToBook(doc) : mapWorkToBook(workData as OpenLibraryWork, cleanId);

  if (workData) {
    const description = extractDescription(workData.description);
    if (description) book.description = description;

    if (workData.subjects?.length && book.genres.length < 2) {
      book.genres = normalizeSubjects(workData.subjects);
    }

    if (!book.cover) {
      const coverId = workData.covers?.find((cover) => cover > 0);
      if (coverId) book.cover = getCoverUrl(coverId);
    }
  }

  return book;
}

/** Sugestões relacionadas ao assunto do livro atual. */
export async function getSuggestions(
  subject: string | undefined,
  excludeId: string,
  limit = 4,
): Promise<Book[]> {
  const cleanSubject = subject?.split(",")[0]?.trim().toLowerCase() || "fiction";

  try {
    const { books } = await searchBooks({ genre: cleanSubject, limit: limit + 4 });
    const filtered = books.filter((book) => book.id !== excludeId);
    if (filtered.length) return filtered.slice(0, limit);
  } catch {
    // Assunto inválido: cai no fallback abaixo.
  }

  const { books } = await searchBooks({ limit: limit + 4 });
  return books.filter((book) => book.id !== excludeId).slice(0, limit);
}
