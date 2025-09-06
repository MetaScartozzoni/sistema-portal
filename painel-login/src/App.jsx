import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import RequestPasswordResetPage from './pages/RequestPasswordResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute, { roleRedirectMap } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

// Placeholders / libs opcionais
const Toaster = () => null; // Substituir por toaster real futuramente
const AnimatePresence = ({ children }) => <>{children}</>; // Framer Motion placeholder

// Página raiz: se autenticado redireciona imediatamente para portal externo conforme role
const RootRedirect = () => {
  const { isAuthenticated, user, checkSession, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkSession();
    }
  }, [isAuthenticated, isLoading, checkSession]);

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const external = roleRedirectMap[user.role];
      if (external) {
        window.location.replace(external);
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <div className="p-8 text-center">Redirecionando...</div>;
};

const AppContent = () => (
  <AnimatePresence>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/recuperar-senha" element={<RequestPasswordResetPage />} />
      <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
      <Route path="/" element={<RootRedirect />} />
      {/* Rota protegida genérica apenas para update-password / fluxos internos futuros */}
      <Route path="/dashboard" element={<ProtectedRoute><div className="p-8 text-center">Redirecionando...</div></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </AnimatePresence>
);

function App() {
  return (
    <>
      <Router>
        <AppContent />
      </Router>
      <Toaster />
    </>
  );
}

export default App;