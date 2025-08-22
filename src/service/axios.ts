import axios from 'axios';
import Cookies from 'universal-cookie';

// Criação da instância do axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
});

// Adicionando um interceptor de requisição
api.interceptors.request.use(
  (config) => {
    const cookies = new Cookies()
    // Recupera o token do localStorage (ou onde você armazena o token)
    const token = cookies.get('token');
    if (token) {
      // Adiciona o token no cabeçalho de todas as requisições
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
