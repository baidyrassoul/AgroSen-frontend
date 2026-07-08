import axios from 'axios';

// En développement : Vite proxy redirige /api → http://localhost:5000/api
// En production : utilise la variable d'environnement VITE_API_URL + /api
const baseURL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
});

// Ajouter automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;