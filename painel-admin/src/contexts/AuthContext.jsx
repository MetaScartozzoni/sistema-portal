import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * AuthContext (Admin) – Versão padronizada
 * Objetivos:
 *  - Unificar interface com outros portais (login, logout, checkSession, fetchMe)
 *  - Suportar modo convidado (VITE_AUTH_DISABLED=true)
 *  - Fornecer helpers de autorização (hasRole / hasPermission)
 *  - Placeholder para refresh / callback SSO futuro
 */

const AuthContext = createContext(null);

// Environment & defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.marcioplasticsurgery.com/api';
const AUTH_DISABLED = import.meta.env.VITE_AUTH_DISABLED === 'true';
const GUEST_ROLE = import.meta.env.VITE_GUEST_ROLE || 'guest';
const DEFAULT_REDIRECT_AFTER_LOGIN = import.meta.env.VITE_DEFAULT_REDIRECT || '/';

// Axios instance isolada
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401 && !AUTH_DISABLED) {
      // Poderíamos disparar uma flag global para re-login.
    }
    return Promise.reject(err);
  }
);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [offline, setOffline] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const redirectRef = useRef(null);

  /* ---------------------- Helpers internos ---------------------- */
  const buildGuestUser = useCallback(() => ({
    id: 'guest_user',
    name: 'Visitante',
    email: 'visitante@clinica.com',
    role: GUEST_ROLE,
    avatar: 'https://avatar.vercel.sh/guest.png',
    permissions: ['read-only']
  }), []);

  const applyGuest = useCallback(() => {
    setUser(buildGuestUser());
    setLoading(false);
  }, [buildGuestUser]);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(user.role);
  }, [user]);

  const hasPermission = useCallback((perm) => {
    if (!user?.permissions) return false;
    const checkList = Array.isArray(perm) ? perm : [perm];
    return checkList.every(p => user.permissions.includes(p));
  }, [user]);

  const setRedirectAfterLogin = useCallback((url) => {
    redirectRef.current = url;
  }, []);

  /* ---------------------- Fluxos de sessão ---------------------- */
  const fetchMe = useCallback(async () => {
    if (AUTH_DISABLED) return; // guest já tratado
    try {
      const { data } = await api.get('/auth/me');
      if (data?.user) setUser(data.user);
    } catch {/* ignore */}
  }, []);

  const checkSession = useCallback(async () => {
    if (AUTH_DISABLED) {
      applyGuest();
      return;
    }
    try {
      setOffline(false);
      const { data } = await api.get('/auth/check');
      if (data?.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
      if (!e.response) setOffline(true);
    } finally {
      setLastCheckedAt(Date.now());
    }
  }, [applyGuest]);

  const refreshSession = useCallback(async () => {
    // Placeholder caso implementemos /auth/refresh (tokens rotativos)
    try {
      if (AUTH_DISABLED) return applyGuest();
      await checkSession();
      await fetchMe();
    } catch {/* noop */}
  }, [checkSession, fetchMe, applyGuest]);

  const login = useCallback(async (email, password) => {
    if (AUTH_DISABLED) {
      applyGuest();
      return { success: true, guest: true };
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data?.success && data.user) {
        setUser(data.user);
        const dest = redirectRef.current || DEFAULT_REDIRECT_AFTER_LOGIN;
        if (dest) navigate(dest, { replace: true });
        return { success: true };
      }
      setError(data?.message || 'Falha no login');
      return { success: false, error: data?.message };
    } catch (e) {
      setError('Erro de conexão');
      return { success: false, error: 'network' };
    } finally {
      setLoading(false);
    }
  }, [navigate, applyGuest]);

  const handleLoginCallback = useCallback(async () => {
    // Futuro: trocar code/token por sessão (/auth/exchange)
    if (AUTH_DISABLED) return { success: true };
    return { success: false, error: 'callback_not_implemented' };
  }, []);

  const logout = useCallback(async () => {
    if (AUTH_DISABLED) {
      setUser(null);
      navigate('/login');
      return;
    }
    try { await api.post('/auth/logout'); } catch {/* ignore */}
    setUser(null);
    setIsLocked(false);
    navigate('/login');
  }, [navigate]);

  /* ---------------------- Lock Screen ---------------------- */
  const lockSession = useCallback(() => {
    if (user && !isLocked) {
      setIsLocked(true);
      navigate('/lock');
    }
  }, [user, isLocked, navigate]);

  const unlockSession = useCallback((pin) => {
    // Exemplo simples – substituir por verificação real depois
    if (pin === '1234') {
      setIsLocked(false);
      const dest = redirectRef.current || DEFAULT_REDIRECT_AFTER_LOGIN;
      if (dest) navigate(dest, { replace: true });
      return true;
    }
    return false;
  }, [navigate]);

  /* ---------------------- Boot inicial ---------------------- */
  useEffect(() => {
    (async () => {
      if (AUTH_DISABLED) {
        applyGuest();
        return;
      }
      await checkSession();
      await fetchMe();
      setLoading(false);
    })();
  }, [applyGuest, checkSession, fetchMe]);

  /* ---------------------- Valor do contexto ---------------------- */
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    offline,
    lastCheckedAt,
    authDisabled: AUTH_DISABLED,
    // session actions
    login,
    logout,
    fetchMe,
    checkSession,
    refreshSession,
    handleLoginCallback,
    setRedirectAfterLogin,
    // lock
    isLocked,
    lockSession,
    unlockSession,
    // auth helpers
    hasRole,
    hasPermission,
    // manual set (caso precise injetar a partir de outra camada)
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
};

export default AuthContext;