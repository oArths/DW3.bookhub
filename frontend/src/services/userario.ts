import { api } from "./api";
interface UserInput {
  name: string;
  email: string;
  senha: string;
  bio: string | null;
}

interface UserInputResponse{
    _id: string
    username: string
    email: string
    bio: string
    avatarURL: string
    createdAt: string

}
async function createUser() {
  try {
    const resposta = await api.post("/usuarios");
    console.log(resposta.data);
  } catch (erro) {
    console.error("Erro ao buscar dados:", erro);
  }
}
