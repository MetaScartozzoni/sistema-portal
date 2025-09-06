import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * AuthContext (Secretaria) - unificado cookie-session
 * - Endpoints: /auth/login, /auth/logout, /auth/check, /auth/me
 * - Flag: VITE_AUTH_DISABLED (modo visitante)
 */
const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.marcioplasticsurgery.com/api';
const AUTH_DISABLED = (import.meta.env.VITE_AUTH_DISABLED === 'true');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const injectGuest = useCallback(() => {
    setUser({ email: 'visitante@portal.com', role: 'visitante', name: 'Visitante' });
    setLoading(false);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data?.user) setUser(data.user); else setUser(null);
    } catch { setUser(null); }
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/check');
      if (data?.success && data?.user) setUser(data.user); else if (!data?.success) setUser(null);
    } catch { setUser(null); }
  }, []);

  const login = useCallback(async (email, password) => {
    if (AUTH_DISABLED) return injectGuest();
    setLoading(true); setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data?.success && data?.user) setUser(data.user); else setError(data?.message || 'Falha no login');
    } catch { setError('Erro de conexão'); }
    finally { setLoading(false); }
  }, [injectGuest]);

  const logout = useCallback(async () => {
    if (AUTH_DISABLED) { setUser(null); return; }
    try { await api.post('/auth/logout'); } catch {/* ignore */}
    finally { setUser(null); navigate('/login'); }
  }, [navigate]);

  useEffect(() => {
    if (AUTH_DISABLED) { injectGuest(); return; }
    (async () => { await fetchMe(); await checkSession(); setLoading(false); })();
  }, [injectGuest, fetchMe, checkSession]);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    fetchMe,
    checkSession,
    authDisabled: AUTH_DISABLED
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
};

export default AuthContext;