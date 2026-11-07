import { useState } from "react";
import { BookOpen, Star } from "lucide-react";

/**
 * @typedef {Object} CollectionBook
 * @property {string|number} id
 * @property {string} title
 * @property {string} [author]
 * @property {string|null} [coverUrl]
 * @property {string} status Valor de statusLeitura vindo da API (ex.: "lendo").
 * @property {number|null} [rating] Nota do usuário de 0 a 5 (aceita 3.5). Opcional.
 */

const MAX_RATING = 5;

// Classes completas: o Tailwind não detecta classes montadas dinamicamente.
// As chaves são os valores de statusLeitura normalizados (minúsculas, sem acento, com "_").
const STATUS = {
  quero_ler: { label: "Quero ler", classes: "bg-slate-600" },
  lendo: { label: "Lendo", classes: "bg-blue-600" },
  lido: { label: "Lido", classes: "bg-green-600" },
  abandonado: { label: "Abandonado", classes: "bg-orange-600" },
};

const normalizeStatus = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

// Status desconhecido: mostra o valor cru legível em vez de quebrar.
const humanize = (value) => {
  const text = String(value ?? "").replace(/[_-]+/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "Sem status";
};

const getStatus = (raw) =>
  STATUS[normalizeStatus(raw)] ?? { label: humanize(raw), classes: "bg-slate-600" };

const formatRating = (value) => String(value).replace(".", ",");

const hasRating = (rating) =>
  typeof rating === "number" && Number.isFinite(rating) && rating > 0;

function StarRow({ className }) {
  return (
    <span className="flex shrink-0">
      {Array.from({ length: MAX_RATING }, (_, i) => (
        <Star key={i} className={`size-4 fill-current ${className}`} strokeWidth={0} />
      ))}
    </span>
  );
}

function Stars({ value }) {
  const clamped = Math.min(Math.max(value, 0), MAX_RATING);
  const percent = (clamped / MAX_RATING) * 100;

  return (
    <span
      role="img"
      aria-label={`Nota ${formatRating(clamped)} de ${MAX_RATING}`}
      className="relative inline-flex"
    >
      <span aria-hidden="true" className="flex">
        <StarRow className="text-gray-300" />
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 flex overflow-hidden"
        style={{ width: `${percent}%` }}
      >
        <StarRow className="text-amber-500" />
      </span>
    </span>
  );
}

/**
 * Card de um livro da coleção do usuário.
 * @param {{ book: CollectionBook, onClick?: (book: CollectionBook) => void }} props
 */
export default function BookCard({ book, onClick }) {
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = Boolean(book.coverUrl) && !coverFailed;
  const status = getStatus(book.status);

  const content = (
    <>
      <div className="relative aspect-[2/3] bg-gray-200">
        {showCover ? (
          <img
            src={book.coverUrl}
            alt={`Capa do livro ${book.title}`}
            loading="lazy"
            onError={() => setCoverFailed(true)}
            // Alguns serviços (ex.: Open Library) devolvem uma imagem de 1x1 px
            // quando não têm a capa, sem dar erro. Tratamos como capa indisponível.
            onLoad={(event) => {
              if (event.currentTarget.naturalWidth <= 1) setCoverFailed(true);
            }}
            className="block h-full w-full object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label="Capa indisponível"
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-gray-200 to-gray-300 p-3 text-center text-gray-600"
          >
            <BookOpen className="size-8" aria-hidden="true" />
            <span className="line-clamp-3 text-sm font-semibold">{book.title}</span>
          </div>
        )}
        <span
          className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white ${status.classes}`}
        >
          {status.label}
        </span>
      </div>

      <div className="px-3 pb-3 pt-2.5">
        <h3 title={book.title} className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-gray-900">
          {book.title}
        </h3>
        <p className="mt-1 truncate text-sm text-gray-500">
          {book.author || "Autor desconhecido"}
        </p>

        {hasRating(book.rating) && (
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Stars value={book.rating} />
            <span className="text-gray-500">{formatRating(book.rating)}</span>
          </div>
        )}
      </div>
    </>
  );

  const base =
    "flex w-full max-w-[200px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left";

  return onClick ? (
    <button
      type="button"
      onClick={() => onClick(book)}
      className={`${base} cursor-pointer hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
    >
      {content}
    </button>
  ) : (
    <article className={base}>{content}</article>
  );
}
