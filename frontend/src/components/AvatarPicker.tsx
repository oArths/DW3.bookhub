import { useState } from "react";

/** Estilos do DiceBear oferecidos no seletor de avatar. */
const STYLES = [
  { id: "lorelei", label: "Lorelei" },
  { id: "adventurer", label: "Adventurer" },
  { id: "avataaars", label: "Avataaars" },
  { id: "micah", label: "Micah" },
  { id: "notionists", label: "Notionists" },
  { id: "open-peeps", label: "Open Peeps" },
  { id: "personas", label: "Personas" },
  { id: "miniavs", label: "Miniavs" },
  { id: "fun-emoji", label: "Fun Emoji" },
  { id: "bottts", label: "Bottts" },
  { id: "thumbs", label: "Thumbs" },
  { id: "pixel-art", label: "Pixel Art" },
] as const;

/** Monta a URL do avatar no DiceBear (https://www.dicebear.com) para um estilo/semente. */
function buildDicebearUrl(style: string, seed: string): string {
  const semente = encodeURIComponent(seed.trim() || "BookHub");
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${semente}`;
}

interface AvatarPickerProps {
  /** Semente inicial usada para as prévias (normalmente o nome de usuário). */
  initialSeed: string;
  busy?: boolean;
  onCancel: () => void;
  /** Recebe a URL escolhida. A persistência fica a cargo de quem usa o componente. */
  onConfirm: (avatarUrl: string) => void;
}

function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Seletor de avatar baseado no DiceBear. O usuário escolhe um estilo, pode
 * sortear novas variações e confirma — a URL gerada é salva pelo chamador.
 */
export default function AvatarPicker({
  initialSeed,
  busy = false,
  onCancel,
  onConfirm,
}: AvatarPickerProps) {
  const [seed, setSeed] = useState(initialSeed);
  const [style, setStyle] = useState<string>(STYLES[0].id);

  const selectedUrl = buildDicebearUrl(style, seed);

  return (
    <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={selectedUrl}
            alt="Prévia do avatar selecionado"
            className="h-14 w-14 rounded-full border border-violet-200 bg-white"
          />
          <div>
            <p className="text-xs font-semibold text-slate-800">Escolher avatar</p>
            <p className="text-[10px] text-slate-500">Gerado pelo DiceBear</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSeed(randomSeed())}
          className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-[10px] font-semibold text-violet-700 hover:bg-violet-100"
        >
          Sortear variações
        </button>
      </div>

      <label className="mt-3 block text-[10px] font-semibold text-slate-500">
        Semente
        <input
          value={seed}
          onChange={(event) => setSeed(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-violet-300"
          placeholder="Seu nome ou uma palavra"
        />
      </label>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Estilos de avatar">
        {STYLES.map((item) => {
          const active = style === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={item.label}
              title={item.label}
              onClick={() => setStyle(item.id)}
              className={`rounded-lg border p-1 transition ${
                active ? "border-violet-600 bg-white ring-2 ring-violet-300" : "border-slate-200 bg-white hover:border-violet-300"
              }`}
            >
              <img
                src={buildDicebearUrl(item.id, seed)}
                alt={item.label}
                loading="lazy"
                className="h-10 w-10 rounded-full"
              />
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onConfirm(selectedUrl)}
          disabled={busy}
          className="rounded-lg bg-violet-700 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-violet-800 disabled:opacity-50"
        >
          {busy ? "Salvando..." : "Salvar avatar"}
        </button>
      </div>
    </div>
  );
}
