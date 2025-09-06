import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createAuthStore } from '@portal/shared';

// Usa mesma store já criada no AuthContext (persist key alinhada)
const { useAuthStore } = createAuthStore({ persistKey: 'auth-medico', guestRole: 'medico' });

const BLOCKED_ROLES = ['paciente', 'guest'];

export const ProtectedRoute = ({ children }) => {
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const checkSession = useAuthStore(s => s.checkSession);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !checking) {
      setChecking(true);
      Promise.resolve(checkSession()).finally(() => setChecking(false));
    }
  }, [isAuthenticated, checking, checkSession]);

  useEffect(() => {
    if (isAuthenticated && user && BLOCKED_ROLES.includes(user.role)) {
      const loginUrl = (import.meta.env.VITE_PORTAL_LOGIN_URL) || 'https://portal.marcioplasticsurgery.com/portal-login';
      window.location.replace(`${loginUrl}?redirect=${encodeURIComponent(window.location.href)}`);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-sm text-gray-400">Validando sessão...</p>
        </div>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
