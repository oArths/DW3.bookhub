import { api } from "./api";
export interface UserInputCreate {
  username: string;
  email: string;
  password: string;
  bio: string | null;
}
export type UserInputLogin = Pick<UserInputCreate, "email" | "password">;
export type UserInputForgot = Pick<UserInputCreate, "email">;
export type UserCodeLogin = Pick<UserInputCreate, "email"> & {
  code: string;
};
export type UserCodeResetPassword = Pick<
  UserInputCreate,
  "email" | "password"
> & {
  code: string;
};

export interface UserInputResponse {
  _id: string;
  nome: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
}
/** Campos que o próprio usuário pode editar no perfil. */
export interface UserInputUpdate {
  nome?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}
export interface ApiError {
  erro: string;
  segundos?: number;
}
export interface ApiResponse {
  mensagem: string;
}

async function createUser(
  user: UserInputCreate,
): Promise<UserInputResponse | string> {
  const resposta = await api.post<UserInputResponse>("/usuarios", user);
  return resposta.data;
}
async function loginUser(
  user: UserInputLogin,
): Promise<UserInputResponse | string> {
  const resposta = await api.post<UserInputResponse>("/usuarios/login", user);
  return resposta.data;
}
async function verifyCode(
  user: UserInputForgot,
): Promise<ApiResponse | ApiError> {
  const response = await api.post("/usuarios/forgot-password", user);
  return response.data;
}
async function getCode(user: UserCodeLogin): Promise<ApiResponse | ApiError> {
  const response = await api.post("/usuarios/verify-reset-code", user);
  return response.data;
}
async function resetPassword(
  user: UserCodeResetPassword,
): Promise<UserInputResponse | ApiError> {
  const response = await api.post("/usuarios/reset-password", user);
  return response.data;
}

/** Atualiza os dados editáveis do perfil (nome, username, bio, avatar). */
async function updateUser(
  id: string,
  dados: UserInputUpdate,
): Promise<UserInputResponse> {
  const response = await api.patch<UserInputResponse>(`/usuarios/${id}`, dados);
  return response.data;
}

export {
  createUser,
  loginUser,
  verifyCode,
  getCode,
  resetPassword,
  updateUser,
};
