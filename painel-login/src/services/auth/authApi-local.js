// src/services/auth/authApi-local.js - Adaptado para nossa API
import api from '../api-local';

// Função para salvar token no localStorage
const saveToken = (token) => {
  if (token) {
    localStorage.setItem('auth-token', token);
  }
};

// Função para remover token do localStorage
const removeToken = () => {
  localStorage.removeItem('auth-token');
};

// Login
export async function login(credentials) {
  if (!credentials.email || !credentials.password) {
    return { success: false, message: 'Credenciais incompletas' };
  }
  
  try {
    // Nossa API espera { email, senha } em /login
    const payload = {
      email: credentials.email,
      senha: credentials.password
    };
    
    const { data } = await api.post('/login', payload);
    
    // Se nossa API retornou token, salvar no localStorage
    if (data.token) {
      saveToken(data.token);
    }
    
    return {
      success: true,
      user: data.user,
      message: data.message
    };
  } catch (err) {
    if (err?.response?.data) {
      return { 
        success: false, 
        message: err.response.data.error || 'Erro no login' 
      };
    }
    return { success: false, message: 'Falha na conexão com o servidor' };
  }
}

export async function getMe() {
  try {
    const { data } = await api.get('/api/auth/me');
    return data?.user || null;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    // Remover token local (nossa API ainda não tem endpoint de logout)
    removeToken();
    return { success: true };
  } catch {
    removeToken();
    return { success: true };
  }
}

export async function checkSession() {
  try {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      return { success: false };
    }
    
    // Verificar se o token ainda é válido
    const { data } = await api.get('/api/auth/verify');
    return {
      success: true,
      user: data.user
    };
  } catch {
    removeToken();
    return { success: false };
  }
}

// Update password - Para implementar depois
export async function updatePassword(payload) {
  return { success: false, message: 'Funcionalidade ainda não implementada' };
}

// Request password reset - Para implementar depois  
export async function requestPasswordReset(email) {
  return { success: false, message: 'Funcionalidade ainda não implementada' };
}

// Reset password - Para implementar depois
export async function resetPassword(payload) {
  return { success: false, message: 'Funcionalidade ainda não implementada' };
}

export default { 
  login, 
  getMe, 
  logout, 
  checkSession, 
  updatePassword, 
  requestPasswordReset, 
  resetPassword 
};
