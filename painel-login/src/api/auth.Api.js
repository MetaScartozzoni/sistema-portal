// src/services/auth/authApi.ts
// Camada específica de autenticação (abstração fina sobre ApiService / axios)

import api from '../api';
import type { LoginCredentials, LoginResponse, User } from '../../types/auth';

export interface SessionStatus {
  success: boolean;
  user?: User;
  redirect_url?: string;
  message?: string;
  error?: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  if (!credentials.email || !credentials.password) {
    return { success: false, message: 'Credenciais incompletas' };
  }
  try {
    const { data } = await api.post < LoginResponse > ('/auth/login', credentials);
    return data;
  } catch (err: unknown) {
    if (typeof err === 'object' && err && 'response' in err) {
      interface AxiosLikeError { response?: { data?: LoginResponse }; }
      const resp = (err as AxiosLikeError).response;
      if (resp?.data) return resp.data;
    }
    return { success: false, message: 'Falha na conexão com o servidor' };
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api.get < { success: boolean; user?: User } > ('/auth/me');
    return data?.user || null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<{ success: boolean }> {
  try {
    const { data } = await api.post < { success: boolean } > ('/auth/logout');
    return data;
  } catch {
    return { success: true }; // tolerante a falha
  }
}

export async function checkSession(): Promise<SessionStatus> {
  try {
    const { data } = await api.get < SessionStatus > ('/auth/check');
    return data;
  } catch {
    return { success: false };
  }
}

export default { login, getMe, logout, checkSession };