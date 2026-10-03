import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // Substitua pela sua rota base
  timeout: 30000, // Opcional: tempo limite de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});
