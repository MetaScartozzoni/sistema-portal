import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

/**
 * AuthContext (Bot Portal) - unificado cookie-session
 * - Endpoints: /auth/login, /auth/logout, /auth/check, /auth/me
 * - Flag: VITE_AUTH_DISABLED => modo visitante
 * - Mantém toasts e signUp placeholder (sem persistência local)
 */
const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const AUTH_DISABLED = (import.meta.env.VITE_AUTH_DISABLED === 'true');
const DEV_FAST_LOGIN = (import.meta.env.VITE_DEV_FAST_LOGIN === 'true');

async function api(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const init = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  };
  if (init.body && typeof init.body !== 'string') init.body = JSON.stringify(init.body);
  const res = await fetch(url, init);
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const message = data?.error?.message || res.statusText || 'Request failed';
    throw Object.assign(new Error(message), { status: res.status, data });
  }
  return data;
}

const GUEST_PROFILE = {
  id: 'guest',
  name: 'Visitante',
  email: '',
  role: 'guest',
  avatar: '',
  status: 'active'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const injectGuest = useCallback(() => {
    setUser(GUEST_PROFILE);
    setLoading(false);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api('/me');
      if (res?.user) setUser(res.user); else setUser(null);
    } catch { setUser(null); }
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const res = await api('/auth/check');
      if (res?.success && res?.user) setUser(res.user);
      else if (!res?.success) setUser(null);
    } catch { setUser(null); }
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (AUTH_DISABLED) { injectGuest(); return; }
    setLoading(true); setError(null);
    try {
      const res = await api(DEV_FAST_LOGIN ? '/auth/dev-login' : '/auth/login', { method: 'POST', body: { email, password } });
      const nextUser = res?.user || null;
      if (nextUser) {
        setUser(nextUser);
        toast({ title: '🎉 Login bem-sucedido', description: 'Bem-vindo de volta!' });
        navigate('/');
      } else {
        setError(res?.message || 'Falha no login');
        toast({ variant: 'destructive', title: 'Erro no Login', description: res?.message || 'Falha no login' });
      }
    } catch {
      setError('Erro de conexão');
      toast({ variant: 'destructive', title: 'Erro no Login', description: 'Erro de conexão' });
    } finally {
      setLoading(false);
    }
  }, [injectGuest, toast, navigate]);

  const signUp = useCallback(async (name, email, password, _role = 'user') => {
    // Placeholder: real signup dependerá de endpoint backend
    toast({ title: '✅ Cadastro (simulado)', description: 'Implementar endpoint real /auth/register.' });
    navigate('/login');
  }, [toast, navigate]);

  const signOut = useCallback(async () => {
    if (AUTH_DISABLED) { setUser(GUEST_PROFILE); return; }
    setLoading(true);
    try {
      await api('/auth/logout', { method: 'POST' });
      toast({ title: '👋 Logout', description: 'Sessão encerrada.' });
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao sair', description: 'Falha tentativa de logout.' });
    } finally {
      setUser(GUEST_PROFILE);
      setLoading(false);
      navigate('/');
    }
  }, [toast, navigate]);

  useEffect(() => {
    if (AUTH_DISABLED) { injectGuest(); return; }
    (async () => { await fetchMe(); await checkSession(); setLoading(false); })();
  }, [injectGuest, fetchMe, checkSession]);

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    fetchMe,
    checkSession,
    authDisabled: AUTH_DISABLED
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
