import axios from "axios";

const api = axios.create({
  baseURL: "/api", // o http://localhost/lotteria/backend/api
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔑 fondamentale per le sessioni PHP
});

export default api;
