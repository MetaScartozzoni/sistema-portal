
import React, { createContext, useState, useContext, useMemo } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user] = useState({
    id: 'user-local-01',
    email: 'admin.local@user.com',
  });

  // Alterando para 'admin' para testar as permissões
  const [profile] = useState({
    id: 'user-local-01',
    full_name: 'Admin Local',
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
    app_role: 'admin', // Pode ser 'admin', 'medico', 'secretaria', 'admin_financeiro'
  });

  const [loading] = useState(false);

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    signOut: () => console.log("Sign out clicked (local mode)"),
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
