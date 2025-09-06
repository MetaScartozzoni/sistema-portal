import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * AuthContext (Login Portal)
 * Wrapper fino sobre Zustand + authApi para alinhar interface entre portais.
 * Suporta flag VITE_AUTH_DISABLED (tratada dentro da store via login/check; aqui apenas expõe estado).
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children, autoRefresh = false }) => {
  const auth = useAuth({ enableAutoRefresh: autoRefresh });

  // Se precisar comportamento especial no portal de login (ex: sempre limpar erro ao montar)
  useEffect(() => {
    if (auth.error) auth.clearError();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error('useAuthContext deve ser usado dentro de <AuthProvider>');
  return ctx;
};

export default AuthContext;