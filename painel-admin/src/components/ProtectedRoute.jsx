import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { resolvePostLoginRedirect } from '@portal/shared';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isLocked } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return <Navigate to="/lock" state={{ from: location }} replace />;
  }

  if (!user || ['guest','paciente'].includes(user.role)) {
    // Redireciona para portal login central; fallback rota local
    const target = '/login';
    return <Navigate to={target} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;