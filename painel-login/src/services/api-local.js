// src/services/api-local.js - Configuração para nossa API local
import axios from 'axios';

const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use((config) => {
  // Buscar token do localStorage
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (import.meta.env?.DEV) {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  }
  return config;
});

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response) => {
    if (import.meta.env?.DEV) {
      console.log('API Response:', response.status, response.data);
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    
    // Se receber 401 (não autorizado), remover token inválido
    if (error?.response?.status === 401) {
      localStorage.removeItem('auth-token');
    }
    
    return Promise.reject(error);
  }
);

export default api;
