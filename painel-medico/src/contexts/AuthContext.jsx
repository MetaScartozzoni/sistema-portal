import React, { createContext, useContext, useMemo } from 'react';
import { createAuthStore, getAccessiblePortals } from '@portal/shared';

// Reusa store shared; chave de persistência específica por portal
const { useAuthStore } = createAuthStore({ persistKey: 'auth-medico', guestRole: 'medico' });

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isLoading = useAuthStore(s => s.isLoading);
  const login = useAuthStore(s => s.login);
  const logout = useAuthStore(s => s.logout);
  const checkSession = useAuthStore(s => s.checkSession);
  const fetchMe = useAuthStore(s => s.fetchMe);

  const portals = useMemo(() => getAccessiblePortals(user?.role), [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading: isLoading,
    login,
    logout,
    checkSession,
    fetchMe,
    portals
  }), [user, isAuthenticated, isLoading, login, logout, checkSession, fetchMe, portals]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
};

export default AuthContext;