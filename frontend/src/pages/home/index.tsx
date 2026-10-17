import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import AvatarPicker from "../../components/AvatarPicker";
import { useSession } from "../../store/session";
import { updateUser, type ApiError, type UserInputUpdate } from "../../services/userario";
import {
  createList,
  getUserLists,
  getUserReviews,
  getUserSavedBooks,
  type ItemListaLivro,
  type Lista,
  type Review,
  type StatusLeitura,
} from "../../services/livros";
import { toastSuccess, toastWarn } from "../../utils/toast";
import { avatarUrlSchema, colecaoFormSchema, nomeSchema, usernameSchema } from "../../utils/validacoes";
import { validarComErro, validarComToast } from "../../utils/validarComToast";
import { UserDeafult } from "../../assets";

type NavKey = "informacoes" | "minha-estante" | "livros-salvos" | "colecoes" | "resenhas";

const NAV_ITEMS: { key: NavKey; label: string; target: string }[] = [
  { key: "informacoes", label: "Informações pessoais", target: "informacoes" },
  { key: "minha-estante", label: "Minha estante", target: "livros-salvos" },
  { key: "livros-salvos", label: "Livros salvos", target: "livros-salvos" },
  { key: "colecoes", label: "Coleções de livros", target: "colecoes" },
  { key: "resenhas", label: "Resenhas de livros", target: "resenhas" },
];

const STATUS_LABELS: Record<StatusLeitura, string> = {
  quero_ler: "Quero ler",
  lendo: "Lendo",
  lido: "Lido",
  abandonado: "Abandonado",
};

function formatDate(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

function NavIcon({ id }: { id: NavKey }) {
  const conteudo = {
    informacoes: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      </>
    ),
    "minha-estante": (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 4v16" />
      </>
    ),
    "livros-salvos": <path d="M6 4h12v16l-6-4-6 4z" />,
    colecoes: (
      <>
        <path d="M12 3 3 8l9 5 9-5z" />
        <path d="M3 13l9 5 9-5" />
      </>
    ),
    resenhas: <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />,
  }[id];

  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {conteudo}
    </svg>
  );
}

function Stars({ nota }: { nota: number }) {
  const valor = Math.max(0, Math.min(5, Math.round(nota)));
  return (
    <span className="inline-flex gap-0.5 text-xs" aria-label={`Nota ${valor} de 5`}>
      {[1, 2, 3, 4, 5].map((estrela) => (
        <span key={estrela} className={estrela <= valor ? "text-amber-400" : "text-slate-200"} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
      {children}
    </p>
  );
}

function SectionSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="h-20 w-14 animate-pulse rounded bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface EditableRowProps {
  label: string;
  value: string;
  editing: boolean;
  draft: string;
  saving: boolean;
  error: string;
  placeholder?: string;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
}

function EditableRow({
  label,
  value,
  editing,
  draft,
  saving,
  error,
  placeholder,
  onEdit,
  onCancel,
  onChange,
  onSave,
}: EditableRowProps) {
  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          {editing ? (
            <input
              value={draft}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              disabled={saving}
              autoFocus
              className="mt-1 w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-60"
            />
          ) : (
            <p className="mt-1 truncate text-sm font-medium text-slate-800">{value || "Não informado"}</p>
          )}
          {error && (
            <p className="mt-1 text-[10px] text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-4">
          {editing ? (
            <>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="rounded-lg bg-violet-700 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-violet-800 disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg border border-violet-300 px-3 py-1.5 text-[10px] font-semibold text-violet-700 hover:bg-violet-50"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface StaticRowProps {
  label: string;
  value: string;
  onAction: () => void;
}

function StaticRow({ label, value, onAction }: StaticRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 truncate text-sm font-medium text-slate-800">{value}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="shrink-0 rounded-lg border border-violet-300 px-3 py-1.5 text-[10px] font-semibold text-violet-700 hover:bg-violet-50"
      >
        Editar
      </button>
    </div>
  );
}

export default function Home() {
  const user = useSession((state) => state.user);
  const setUser = useSession((state) => state.setUser);
  const logout = useSession((state) => state.logout);
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState<NavKey>("informacoes");

  const [listas, setListas] = useState<Lista[]>([]);
  const [livrosSalvos, setLivrosSalvos] = useState<ItemListaLivro[]>([]);
  const [resenhas, setResenhas] = useState<Review[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [editingField, setEditingField] = useState<"nome" | "username" | null>(null);
  const [draft, setDraft] = useState("");
  const [savingField, setSavingField] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const [novaColecaoAberta, setNovaColecaoAberta] = useState(false);
  const [novaColecaoNome, setNovaColecaoNome] = useState("");
  const [novaColecaoDescricao, setNovaColecaoDescricao] = useState("");
  const [criandoColecao, setCriandoColecao] = useState(false);
  const [colecaoError, setColecaoError] = useState("");

  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    let active = true;

    (async () => {
      setDataLoading(true);
      setDataError("");

      try {
        const [listasData, salvosData, resenhasData] = await Promise.all([
          getUserLists(userId),
          getUserSavedBooks(userId),
          getUserReviews(userId),
        ]);

        if (!active) return;
        setListas(listasData);
        setLivrosSalvos(salvosData);
        setResenhas(resenhasData);
      } catch {
        if (!active) return;
        setDataError("Não foi possível carregar suas informações de leitura.");
      } finally {
        if (active) setDataLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [userId, reloadKey]);

  const livrosUnicos = useMemo(() => {
    const vistos = new Set<string>();
    const resultado: ItemListaLivro[] = [];

    for (const item of livrosSalvos) {
      const livro = item.livroId;
      if (!livro || vistos.has(livro._id)) continue;
      vistos.add(livro._id);
      resultado.push(item);
    }

    return resultado;
  }, [livrosSalvos]);

  const capaPorLivro = useMemo(() => {
    const mapa = new Map<string, { titulo: string; capaUrl: string }>();
    for (const item of livrosSalvos) {
      if (item.livroId) {
        mapa.set(item.livroId._id, { titulo: item.livroId.titulo, capaUrl: item.livroId.capaUrl });
      }
    }
    return mapa;
  }, [livrosSalvos]);

  function irParaSecao(item: { key: NavKey; target: string }) {
    setActiveNav(item.key);
    document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function sair() {
    logout();
    navigate("/login");
  }

  function iniciarEdicao(field: "nome" | "username", valorAtual: string) {
    setEditingField(field);
    setDraft(valorAtual);
    setFieldError("");
  }

  function cancelarEdicao() {
    setEditingField(null);
    setDraft("");
    setFieldError("");
  }

  async function salvarCampo(field: "nome" | "username") {
    if (!user) return;

    // Valida com o mesmo schema do back-end; se falhar, mostra no toast
    // (e também inline, logo abaixo do campo).
    const resultado =
      field === "nome" ? validarComErro(nomeSchema, draft) : validarComErro(usernameSchema, draft);

    if (!resultado.ok) {
      setFieldError(resultado.erro);
      toastWarn(resultado.erro);
      return;
    }

    const valor = resultado.data;
    const payload: UserInputUpdate = field === "nome" ? { nome: valor } : { username: valor };

    setSavingField(true);
    try {
      const atualizado = await updateUser(user._id, payload);
      setUser({ ...user, ...atualizado });
      setEditingField(null);
      setDraft("");
      setFieldError("");
      toastSuccess(field === "nome" ? "Nome atualizado com sucesso." : "Nome de usuário atualizado com sucesso.");
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setFieldError(error.response?.data?.erro ?? "Não foi possível salvar. Tente novamente.");
      } else {
        setFieldError("Ocorreu um erro inesperado ao salvar. Tente novamente.");
      }
    } finally {
      setSavingField(false);
    }
  }

  async function salvarAvatar(avatarUrl: string) {
    if (!user) return;

    const escolhido = validarComToast(avatarUrlSchema, avatarUrl);
    if (!escolhido) return;

    setSavingAvatar(true);
    try {
      const atualizado = await updateUser(user._id, { avatarUrl: escolhido });
      setUser({ ...user, ...atualizado });
      setAvatarPickerOpen(false);
      toastSuccess("Avatar atualizado com sucesso.");
    } catch {
      toastWarn("Não foi possível salvar o avatar. Tente novamente.");
    } finally {
      setSavingAvatar(false);
    }
  }

  async function criarColecao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const resultado = validarComErro(colecaoFormSchema, {
      nome: novaColecaoNome,
      descricao: novaColecaoDescricao,
    });

    if (!resultado.ok) {
      setColecaoError(resultado.erro);
      toastWarn(resultado.erro);
      return;
    }

    setCriandoColecao(true);
    try {
      const lista = await createList({
        usuarioId: user._id,
        nome: resultado.data.nome,
        descricao: (resultado.data.descricao ?? "").trim(),
      });
      setListas((current) => [lista, ...current]);
      setNovaColecaoAberta(false);
      setNovaColecaoNome("");
      setNovaColecaoDescricao("");
      setColecaoError("");
      toastSuccess("Coleção criada com sucesso.");
    } catch {
      setColecaoError("Não foi possível criar a coleção. Tente novamente.");
    } finally {
      setCriandoColecao(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-5 py-16 text-center">
          <p className="text-sm text-slate-500">Você precisa estar logado para ver o perfil.</p>
          <Link
            to="/login"
            className="mt-4 inline-block rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800"
          >
            Entrar
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar do perfil */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl || UserDeafult}
                  alt={`Avatar de ${user.username}`}
                  className="h-12 w-12 rounded-full border border-slate-200 bg-white object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{user.nome || user.username}</p>
                  <p className="truncate text-[10px] text-slate-500">@{user.username}</p>
                </div>
              </div>

              <nav className="mt-4 flex flex-col gap-1" aria-label="Navegação do perfil">
                {NAV_ITEMS.map((item) => {
                  const ativo = activeNav === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => irParaSecao(item)}
                      aria-current={ativo ? "true" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                        ativo
                          ? "bg-violet-50 text-violet-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-violet-700"
                      }`}
                    >
                      <NavIcon id={item.key} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={sair}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
                    <path d="M10 17l-5-5 5-5" />
                    <path d="M5 12h10" />
                  </svg>
                  Sair
                </button>
              </div>
            </div>
          </aside>

          {/* Conteúdo do perfil */}
          <div className="flex flex-col gap-8">
            <section id="informacoes" className="scroll-mt-6">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">Minha conta</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Informações pessoais</h1>
                <p className="mt-1 text-xs text-slate-500">Gerencie os dados vinculados à sua conta.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatarUrl || UserDeafult}
                      alt={`Avatar de ${user.username}`}
                      className="h-16 w-16 rounded-full border border-slate-200 bg-white object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Avatar do perfil</p>
                      <p className="text-[10px] text-slate-500">Seleção obrigatória</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAvatarPickerOpen((aberto) => !aberto)}
                    className="rounded-lg border border-violet-300 px-3 py-1.5 text-[10px] font-semibold text-violet-700 hover:bg-violet-50"
                  >
                    Escolher avatar
                  </button>
                </div>

                {avatarPickerOpen && (
                  <AvatarPicker
                    initialSeed={user.username || user.nome || user._id}
                    busy={savingAvatar}
                    onCancel={() => setAvatarPickerOpen(false)}
                    onConfirm={salvarAvatar}
                  />
                )}

                <div className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                  <EditableRow
                    label="Nome completo"
                    value={user.nome ?? ""}
                    editing={editingField === "nome"}
                    draft={draft}
                    saving={savingField && editingField === "nome"}
                    error={editingField === "nome" ? fieldError : ""}
                    placeholder="Como você quer ser chamado"
                    onEdit={() => iniciarEdicao("nome", user.nome ?? "")}
                    onCancel={cancelarEdicao}
                    onChange={setDraft}
                    onSave={() => salvarCampo("nome")}
                  />

                  <EditableRow
                    label="Nome de usuário"
                    value={user.username}
                    editing={editingField === "username"}
                    draft={draft}
                    saving={savingField && editingField === "username"}
                    error={editingField === "username" ? fieldError : ""}
                    placeholder="nome_de_usuario"
                    onEdit={() => iniciarEdicao("username", user.username)}
                    onCancel={cancelarEdicao}
                    onChange={setDraft}
                    onSave={() => salvarCampo("username")}
                  />

                  <StaticRow
                    label="E-mail"
                    value={user.email}
                    onAction={() =>
                      toastWarn("A alteração de e-mail passa pela verificação da conta. Use a recuperação de senha.")
                    }
                  />

                  <StaticRow
                    label="Senha"
                    value="••••••••"
                    onAction={() => navigate("/recuperar-senha")}
                  />
                </div>
              </div>
            </section>

            {dataError && (
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
                role="alert"
              >
                <span>{dataError}</span>
                <button
                  type="button"
                  onClick={() => setReloadKey((current) => current + 1)}
                  className="rounded-md bg-red-700 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-red-800"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            <section id="livros-salvos" className="scroll-mt-6">
              <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Livros salvos</h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {dataLoading
                      ? "Carregando..."
                      : `${livrosUnicos.length} ${livrosUnicos.length === 1 ? "livro salvo" : "livros salvos"} na sua estante.`}
                  </p>
                </div>
                <Link to="/catalogo" className="shrink-0 text-[10px] font-semibold text-violet-700 hover:underline">
                  Explorar catálogo →
                </Link>
              </div>

              {dataLoading ? (
                <SectionSkeleton />
              ) : livrosUnicos.length === 0 ? (
                <EmptyState>
                  Você ainda não salvou nenhum livro.{" "}
                  <Link to="/catalogo" className="font-semibold text-violet-700 hover:underline">
                    Explorar o catálogo
                  </Link>
                </EmptyState>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {livrosUnicos.map((item) =>
                    item.livroId ? (
                      <Link
                        key={item._id}
                        to={`/livros/${item.livroId.idExterno}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-50">
                          {item.livroId.capaUrl ? (
                            <img
                              src={item.livroId.capaUrl}
                              alt={`Capa de ${item.livroId.titulo}`}
                              loading="lazy"
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-[9px] text-slate-300">Sem capa</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900">{item.livroId.titulo}</p>
                          <span className="mt-1 inline-block rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-semibold text-violet-700">
                            {STATUS_LABELS[item.statusLeitura]}
                          </span>
                        </div>
                      </Link>
                    ) : null,
                  )}
                </div>
              )}
            </section>

            <section id="colecoes" className="scroll-mt-6">
              <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Coleções de livros</h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">Organize seus livros em coleções.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNovaColecaoAberta((aberta) => !aberta);
                    setColecaoError("");
                  }}
                  className="shrink-0 rounded-lg bg-violet-700 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-violet-800"
                >
                  + Nova coleção
                </button>
              </div>

              {novaColecaoAberta && (
                <form
                  onSubmit={criarColecao}
                  className="mb-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-[10px] font-semibold text-slate-500">
                      Nome da coleção
                      <input
                        value={novaColecaoNome}
                        onChange={(event) => setNovaColecaoNome(event.target.value)}
                        disabled={criandoColecao}
                        placeholder="Ex.: Clássicos da literatura"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-60"
                      />
                    </label>
                    <label className="text-[10px] font-semibold text-slate-500">
                      Descrição (opcional)
                      <input
                        value={novaColecaoDescricao}
                        onChange={(event) => setNovaColecaoDescricao(event.target.value)}
                        disabled={criandoColecao}
                        placeholder="Sobre o que é essa coleção"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-60"
                      />
                    </label>
                  </div>
                  {colecaoError && (
                    <p className="mt-2 text-[10px] text-red-600" role="alert">
                      {colecaoError}
                    </p>
                  )}
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setNovaColecaoAberta(false)}
                      disabled={criandoColecao}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={criandoColecao}
                      className="rounded-lg bg-violet-700 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-violet-800 disabled:opacity-50"
                    >
                      {criandoColecao ? "Criando..." : "Criar coleção"}
                    </button>
                  </div>
                </form>
              )}

              {dataLoading ? (
                <SectionSkeleton />
              ) : listas.length === 0 ? (
                <EmptyState>Você ainda não criou nenhuma coleção.</EmptyState>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {listas.map((lista) => {
                    const capa = lista.livroIds
                      .map((id) => capaPorLivro.get(id))
                      .find((item) => item?.capaUrl);

                    return (
                      <article
                        key={lista._id}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="flex h-28 items-center justify-center bg-gradient-to-br from-violet-100 to-violet-50">
                          {capa?.capaUrl ? (
                            <img
                              src={capa.capaUrl}
                              alt={`Capa de ${capa.titulo}`}
                              loading="lazy"
                              className="h-20 object-contain"
                            />
                          ) : (
                            <span className="text-violet-300">
                              <NavIcon id="colecoes" />
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="truncate text-xs font-bold text-slate-900">{lista.nome}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">
                            {lista.livroIds.length} {lista.livroIds.length === 1 ? "livro" : "livros"}
                          </p>
                          {lista.descricao && (
                            <p className="mt-1 truncate text-[10px] text-slate-400">{lista.descricao}</p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <section id="resenhas" className="scroll-mt-6">
              <div className="mb-3">
                <h2 className="text-base font-bold text-slate-900">Resenhas de livros</h2>
                <p className="mt-0.5 text-[11px] text-slate-500">As avaliações que você escreveu.</p>
              </div>

              {dataLoading ? (
                <SectionSkeleton />
              ) : resenhas.length === 0 ? (
                <EmptyState>Você ainda não escreveu nenhuma resenha.</EmptyState>
              ) : (
                <div className="flex flex-col gap-3">
                  {resenhas.map((resenha) => (
                    <article
                      key={resenha._id}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/livros/${resenha.livroId?.idExterno ?? ""}`}
                            className="truncate text-xs font-bold text-slate-900 hover:text-violet-700"
                          >
                            {resenha.livroId?.titulo ?? "Livro"}
                          </Link>
                          <div className="mt-1">
                            <Stars nota={resenha.nota} />
                          </div>
                        </div>
                        <time className="shrink-0 text-[10px] text-slate-400">{formatDate(resenha.createdAt)}</time>
                      </div>
                      {resenha.texto && (
                        <p className="mt-2 text-[11px] leading-5 text-slate-500">{resenha.texto}</p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
