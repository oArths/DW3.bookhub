import { useState, type FormEvent } from "react";

export interface ReviewSubmission {
  rating: number;
  comment: string;
}

interface ReviewFormProps {
  onSubmit: (review: ReviewSubmission) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === 0) {
      setError("Escolha uma nota de 1 a 5 estrelas.");
      setSubmitted(false);
      return;
    }

    onSubmit({ rating, comment: comment.trim() });
    setError("");
    setSubmitted(true);
  }

  const displayedRating = hoveredRating || rating;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-bold text-slate-900">Deixe sua avaliação</h3>
      <p className="mt-1 text-xs text-slate-500">Quanto você gostou deste livro?</p>

      <fieldset className="mt-3">
        <legend className="sr-only">Escolha uma nota de 1 a 5 estrelas</legend>
        <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setRating(value);
                setError("");
                setSubmitted(false);
              }}
              onMouseEnter={() => setHoveredRating(value)}
              aria-label={`${value} ${value === 1 ? "estrela" : "estrelas"}`}
              aria-pressed={rating === value}
              className="rounded p-1 text-3xl leading-none transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <span className={value <= displayedRating ? "text-amber-400" : "text-slate-300"} aria-hidden="true">
                ★
              </span>
            </button>
          ))}
          <span className="ml-2 text-xs text-slate-500" aria-live="polite">
            {displayedRating > 0 ? `${displayedRating} de 5` : "Selecione as estrelas"}
          </span>
        </div>
      </fieldset>

      <label htmlFor="review-comment" className="mt-4 block text-xs font-medium text-slate-700">
        Comentário <span className="font-normal text-slate-400">(opcional)</span>
      </label>
      <textarea
        id="review-comment"
        value={comment}
        onChange={(event) => {
          setComment(event.target.value);
          setSubmitted(false);
        }}
        maxLength={1000}
        rows={3}
        placeholder="Conte o que achou da leitura..."
        className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] text-slate-400">Demonstração: a avaliação ainda não é salva no servidor.</p>
        <button
          type="submit"
          className="rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
        >
          Enviar avaliação
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600" role="alert">{error}</p>}
      {submitted && (
        <p className="mt-2 text-xs text-emerald-700" role="status">
          Avaliação registrada nesta demonstração; ela não foi salva no servidor.
        </p>
      )}
    </form>
  );
}
