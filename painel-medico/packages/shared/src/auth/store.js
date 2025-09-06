import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const getEnv = () => {
  try {
    return (typeof import.meta !== 'undefined' && import.meta.env) || undefined;
  } catch { return undefined; }
};

const envAny = (keys = [], fallback = undefined) => {
  const e = getEnv() || {};
  for (const k of keys) {
    if (e[k]) return e[k];
  }
  return fallback;
};

export const createAuthStore = (config = {}) => {
  const {
    apiBaseUrl = (getEnv()?.VITE_API_BASE_URL) || 'https://api.marcioplasticsurgery.com/api',
    loginPortalUrl = envAny(['VITE_PORTAL_LOGIN_URL', 'VITE_LOGIN_PORTAL_URL'], 'https://portal.marcioplasticsurgery.com/portal-login'),
    guestRole = 'medico',
    persistKey = 'auth-shared'
  } = config;

  const AUTH_DISABLED = (getEnv()?.VITE_AUTH_DISABLED === 'true');

  const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' }
  });

  api.interceptors.response.use(
    (resp) => resp,
    (error) => {
      if (error?.response?.status === 401) {
        try {
          const current = window.location.href;
          if (!current.includes('/portal-login')) {
            window.location.replace(`${loginPortalUrl}?redirect=${encodeURIComponent(current)}`);
          }
        } catch {}
      }
      return Promise.reject(error);
    }
  );

  const useStore = create(persist((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async () => {
      const current = window.location.href;
      window.location.href = `${loginPortalUrl}?redirect=${encodeURIComponent(current)}`;
    },
    logout: async () => {
      if (AUTH_DISABLED) {
        set({ user: null, isAuthenticated: false });
        return;
      }
      try { await api.post('/auth/logout'); } catch {}
      set({ user: null, isAuthenticated: false });
      window.location.href = `${loginPortalUrl}`;
    },
    checkSession: async () => {
      if (AUTH_DISABLED) {
        set({ user: { id: 'guest', role: guestRole, email: 'guest@demo.com' }, isAuthenticated: true });
        return;
      }
      set({ isLoading: true });
      try {
        const { data } = await api.get('/auth/check');
        if (data?.success && data.user) {
          set({ user: data.user, isAuthenticated: true });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      } catch {
        set({ user: null, isAuthenticated: false });
      } finally {
        set({ isLoading: false });
      }
    },
    fetchMe: async () => {
      if (AUTH_DISABLED) return;
      try {
        const { data } = await api.get('/auth/me');
        if (data?.user) set({ user: data.user, isAuthenticated: true });
      } catch {}
    },
    clearError: () => set({ error: null })
  }), { name: persistKey }));

  return { useAuthStore: useStore, api };
};
