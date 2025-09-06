import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { LoginLayout } from '../components/LoginLayout';
import { resolvePostLoginRedirect, PortalSwitcher } from '@portal/shared';
import { useAuthStore } from '../store/authStore';
// Using shared helpers/components

export const LoginPage = () => {
  const { login, isAuthenticated, isLoading, error, clearError, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (isAuthenticated) {
    const params = new URLSearchParams(location.search);
    const explicit = params.get('redirect');
    const target = explicit || resolvePostLoginRedirect({ role: user?.role });
    if (/^https?:\/\//i.test(target) && !target.startsWith(window.location.origin)) {
      window.location.replace(target); return null;
    }
    return <Navigate to={target} replace />;
  }

  const handleLogin = async (credentials) => {
    clearError();
    
    const result = await login(credentials);
    
    if (result.success) {
      const params = new URLSearchParams(location.search);
      const explicit = params.get('redirect');
      const computed = resolvePostLoginRedirect({ role: result?.user?.role || user?.role });
      const target = result.redirect_url || explicit || computed || '/dashboard';
      if (/^https?:\/\//i.test(target) && !target.startsWith(window.location.origin)) {
        window.location.href = target; return;
      }
      navigate(target, { replace: true });
    }
  };

  const quickRoles = [
    { label: 'Admin', email: 'admin@demo.com', password: 'admin123' },
    { label: 'Médico', email: 'medico@demo.com', password: 'medico123' },
    { label: 'Secretaria', email: 'secretaria@demo.com', password: 'secret123' },
  ];

  return (
    <LoginLayout>
      <div style={{ marginBottom: '1rem' }}>
        <PortalSwitcher role={user?.role || 'guest'} currentCode="login" variant="inline" />
      </div>
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
        quickRoles={quickRoles}
      />
    </LoginLayout>
  );
};
