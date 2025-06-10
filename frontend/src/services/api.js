import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // coloque a URL do seu backend aqui
});

// Interceptor para adicionar token JWT no header Authorization
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
