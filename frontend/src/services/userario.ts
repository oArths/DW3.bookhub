import axios from "axios";
import { api } from "./api";
export interface UserInputCreate {
  username: string;
  email: string;
  password: string;
  bio: string | null;
}
export type UserInputLogin = Pick<UserInputCreate, "email" | "password">;

export interface UserInputResponse {
  _id: string;
  username: string;
  email: string;
  bio: string;
  avatarURL: string;
  createdAt: string;
}
export interface ApiError {
  erro: string;
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

export { createUser, loginUser };
