// src/services/auth/authApi.js
import api from '../api';

// Login
export async function login(credentials) {
  if (!credentials.email || !credentials.password) {
    return { success: false, message: 'Credenciais incompletas' };
  }
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  } catch (err) {
    if (err?.response?.data) return err.response.data;
    return { success: false, message: 'Falha na conexão com o servidor' };
  }
}

export async function getMe() {
  try {
    const { data } = await api.get('/auth/me');
    return data?.user || null;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    const { data } = await api.post('/auth/logout');
    return data;
  } catch {
    return { success: true };
  }
}

export async function checkSession() {
  try {
    const { data } = await api.get('/auth/check');
    return data;
  } catch {
    return { success: false };
  }
}

// Update password (complexidade validada também no backend)
const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}\[\]:;"'<>?,./]).{8,72}$/;
export async function updatePassword(payload) {
  if (!payload.currentPassword || !payload.newPassword) return { success: false, message: 'Dados incompletos' };
  if (!complexityRegex.test(payload.newPassword)) {
    return { success: false, message: 'Senha fraca: mínimo 8, maiúscula, minúscula, número e símbolo.' };
  }
  try {
    const { data } = await api.post('/auth/update-password', payload);
    return data;
  } catch (err) {
    if (err?.response?.data) return err.response.data;
    return { success: false, message: 'Erro ao atualizar senha' };
  }
}

export async function requestPasswordReset(email) {
  if (!email) return { success: false, message: 'Email obrigatório' };
  try {
    const { data } = await api.post('/auth/password/reset-request', { email });
    return data;
  } catch (err) {
    if (err?.response?.data) return err.response.data;
    return { success: false, message: 'Erro ao solicitar reset' };
  }
}

export async function resetPassword(payload) {
  if (!payload.token || !payload.newPassword) return { success: false, message: 'Dados incompletos' };
  if (!complexityRegex.test(payload.newPassword)) {
    return { success: false, message: 'Senha fraca: mínimo 8, maiúscula, minúscula, número e símbolo.' };
  }
  try {
    const { data } = await api.post('/auth/password/reset', payload);
    return data;
  } catch (err) {
    if (err?.response?.data) return err.response.data;
    return { success: false, message: 'Erro ao redefinir senha' };
  }
}

export default { login, getMe, logout, checkSession, updatePassword, requestPasswordReset, resetPassword };
