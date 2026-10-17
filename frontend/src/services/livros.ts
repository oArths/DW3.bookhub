import { api } from "./api";

/** Referência resumida de um livro guardado no banco (populate de `livroId`). */
export interface LivroResumo {
  _id: string;
  idExterno: string;
  titulo: string;
  capaUrl: string;
}

/** Uma coleção (lista) de livros do usuário. */
export interface Lista {
  _id: string;
  usuarioId: string;
  nome: string;
  descricao: string;
  livroIds: string[];
  createdAt: string;
}

export type StatusLeitura = "quero_ler" | "lendo" | "lido" | "abandonado";

/** Um livro dentro de uma lista do usuário. */
export interface ItemListaLivro {
  _id: string;
  listaId: string | { _id: string; nome: string };
  usuarioId: string;
  livroId: LivroResumo | null;
  statusLeitura: StatusLeitura;
  adicionadoEm: string;
}

/** Avaliação escrita pelo usuário. */
export interface Review {
  _id: string;
  usuarioId: string;
  livroId: LivroResumo | null;
  nota: number;
  texto: string;
  createdAt: string;
}

/** Todas as coleções (listas) de um usuário. */
export async function getUserLists(usuarioId: string): Promise<Lista[]> {
  const { data } = await api.get<Lista[]>(`/listas/usuario/${usuarioId}`);
  return data;
}

/** Livros de uma lista específica. */
export async function getListBooks(listaId: string): Promise<ItemListaLivro[]> {
  const { data } = await api.get<ItemListaLivro[]>(`/listas/${listaId}/livros`);
  return data;
}

/** Todos os livros salvos pelo usuário, em qualquer uma das suas listas. */
export async function getUserSavedBooks(
  usuarioId: string,
): Promise<ItemListaLivro[]> {
  const { data } = await api.get<ItemListaLivro[]>(
    `/listas/livros/usuario/${usuarioId}`,
  );
  return data;
}

/** Cria uma nova coleção para o usuário. */
export async function createList(payload: {
  usuarioId: string;
  nome: string;
  descricao?: string;
}): Promise<Lista> {
  const { data } = await api.post<Lista>("/listas", payload);
  return data;
}

/** Avaliações escritas por um usuário. */
export async function getUserReviews(usuarioId: string): Promise<Review[]> {
  const { data } = await api.get<Review[]>(`/reviews/usuario/${usuarioId}`);
  return data;
}
