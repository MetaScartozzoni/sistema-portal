import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const roleRedirectMap = {
  admin: 'https://portal.marcioplasticsurgery.com/portal-admin',
  medico: 'https://portal.marcioplasticsurgery.com/portal-medico',
  secretaria: 'https://portal.marcioplasticsurgery.com/portal-secretaria',
  paciente: 'https://portal.marcioplasticsurgery.com/portal-paciente',
};

const ProtectedRoute = ({ children, allowRoles }) => {
  const { user, isAuthenticated, isLoading, checkSession } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkSession();
    }
  }, [isAuthenticated, isLoading, checkSession]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowRoles && !allowRoles.includes(user.role)) {
    const external = roleRedirectMap[user.role];
    if (external) { window.location.href = external; return null; }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
