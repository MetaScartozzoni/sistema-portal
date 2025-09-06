import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import CadernoDigital from '@/pages/CadernoDigital';
import Journey from '@/pages/Journey';
import Evolution from '@/pages/Evolution';
import ProtocolConfig from '@/pages/ProtocolConfig';
import AdminConfig from '@/pages/AdminConfig';
import Messages from '@/pages/Messages';
import Agenda from '@/pages/Agenda';
import Teleconsultas from '@/pages/Teleconsultas';
import { ToastProvider } from '@/components/ui/ToastProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

const LOGIN_PORTAL_URL = import.meta.env.VITE_LOGIN_PORTAL_URL || 'https://portal.marcioplasticsurgery.com/portal-login';

const AppRoutes = () => {
  const { isLoading, isAuthenticated, user } = useAuthStore();
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">Carregando Sessão...</div>;
  }
  return (
    <Routes>
      <Route path="/login" element={<RedirectToLogin />} />
      <Route path="/*" element={
        <ProtectedRoute allowRoles={['medico']}> 
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/doctor" replace />} />
              <Route path="/dashboard/doctor" element={<Dashboard />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/teleconsultas" element={<Teleconsultas />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id/caderno" element={<CadernoDigital />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/evolution" element={<Evolution />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/protocol-config" element={<ProtocolConfig />} />
              <Route path="/admin/config" element={<AdminConfig />} />
              <Route path="*" element={<Navigate to="/dashboard/doctor" replace />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const RedirectToLogin = () => {
  // Encaminha sempre para portal central com redirect
  const target = `${LOGIN_PORTAL_URL}?redirect=${encodeURIComponent(window.location.href.replace(/\/login$/, ''))}`;
  window.location.replace(target);
  return <div className="min-h-screen flex items-center justify-center text-white">Redirecionando para portal de login...</div>;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <Helmet>
          <title>Portal do Médico - Sistema de Gestão Médica</title>
          <meta name="description" content="Sistema completo para gestão de pacientes, caderno digital e acompanhamento médico para cirurgiões plásticos" />
          <meta property="og:title" content="Portal do Médico - Sistema de Gestão Médica" />
          <meta property="og:description" content="Sistema completo para gestão de pacientes, caderno digital e acompanhamento médico para cirurgiões plásticos" />
        </Helmet>
        <AppRoutes />
        <Toaster />
      </ToastProvider>
    </Router>
  );
}

export default App;