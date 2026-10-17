import axios from "axios";

export const api_google = axios.create({
  baseURL: "https://openlibrary.org/search.json?", 
  timeout: 30000, // Opcional: tempo limite de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});
