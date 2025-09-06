// src/store/authStore.js (versão JS)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Seleciona adaptador remoto (authApi) para testar API externa
import * as authApi from '../services/auth/authApi';

export const useAuthStore = create(persist((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      // Possíveis formatos: { success, user, token } ou { token, user } ou erro
      const user = response?.user || null;
      const hasSuccessFlag = typeof response?.success !== 'undefined';
      const ok = (hasSuccessFlag && response.success && user) || (!hasSuccessFlag && (response.token || user));

      if (ok && user) {
        // Persistir token se existir (caso backend use JWT em header futuramente)
        if (response.token) {
          try { localStorage.setItem('auth-token', response.token); } catch { /* ignore */ }
        }
        set({ user, isAuthenticated: true, isLoading: false, error: null });
        return { success: true, user, redirect_url: response.redirect_url };
      }

      const message = response?.message || response?.error || 'Erro no login';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Erro de conexão';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try { await authApi.logout(); } catch { /* ignore */ }
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },
  checkSession: async () => {
    set({ isLoading: true });
    try {
      const res = await authApi.checkSession();
      if (res.success && res.user) {
        set({ user: res.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const user = await authApi.getMe();
      if (user) set({ user, isAuthenticated: true, isLoading: false });
      else set({ user: null, isAuthenticated: false, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  clearError: () => set({ error: null }),
  setLoading: (isLoading) => set({ isLoading }),
}), {
  name: 'auth-storage',
  partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
}));
