import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [session, setSession] = useLocalStorage('horizons-session', null);
  const [profile, setProfile] = useLocalStorage('horizons-profile', null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, _setProfileLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const signUp = useCallback(async (_email, _password, _options) => {
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Agora você pode fazer o login com suas credenciais.",
    });
    return { error: null };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    if (email && password) {
      const mockSession = { user: { id: 'mock-user-id', email: email }, access_token: 'mock-token' };
      const mockProfile = { full_name: 'Usuário Mock', role: 'admin' };
      
      setSession(mockSession);
      setProfile(mockProfile);
      
      toast({
        title: `👋 Bem-vindo(a) de volta!`,
        description: `Login simulado com sucesso.`,
      });
      return { error: null };
    } else {
      const error = { message: "E-mail ou senha inválidos." };
      toast({
        variant: "destructive",
        title: "Falha no Login",
        description: error.message,
      });
      return { error };
    }
  }, [setSession, setProfile, toast]);

  const signOut = useCallback(async () => {
    setSession(null);
    setProfile(null);
    toast({
      title: "👋 Até logo!",
      description: "Você foi desconectado com sucesso."
    });
  }, [setSession, setProfile, toast]);

  const value = useMemo(() => ({
    user: session?.user,
    session,
    profile,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut,
  }), [session, profile, loading, profileLoading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
