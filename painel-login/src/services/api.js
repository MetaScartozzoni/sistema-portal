// src/services/api.js (JS versão)
import axios from 'axios';

// Base inclui /api conforme mapeamento de endpoints
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'https://api.marcioplasticsurgery.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch { /* ignore storage errors */ }
  if (import.meta.env?.DEV) console.log('API Request', config.method?.toUpperCase(), config.url);
  return config;
});
api.interceptors.response.use(
  (resp) => {
    if (import.meta.env?.DEV) console.log('API Response', resp.status, resp.data);
    return resp;
  },
  (error) => {
    console.error('API Error', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
