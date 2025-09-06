import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/Users';
import Permissions from '@/pages/Permissions';
import CentralSchedule from '@/pages/CentralSchedule';
import CalendarSettings from '@/pages/CalendarSettings';
import Settings from '@/pages/Settings';
import Integrations from '@/pages/Integrations';
import Logs from '@/pages/Logs';
import LogsManual from '@/pages/LogsManual';
import Documents from '@/pages/Documents';
import ProtectedRoute from '@/components/ProtectedRoute';
import PatientJourney from '@/pages/PatientJourney';
import Protocols from '@/pages/Protocols';
import Profile from '@/pages/Profile';
import AuthCallback from '@/pages/AuthCallback';
import LockScreen from '@/pages/LockScreen';

const AppContent = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/lock" element={<LockScreen />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
            <Route path="patient-journey" element={<PatientJourney />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="schedule" element={<CentralSchedule />} />
            <Route path="calendar-settings" element={<CalendarSettings />} />
            <Route path="documents" element={<Documents />} />
            <Route path="settings" element={<Settings />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="protocols" element={<Protocols />} />
            <Route path="logs" element={<Logs />} />
            <Route path="logs/manual" element={<LogsManual />} />
          </Route>
        </Routes>
        <Toaster />
      </DataProvider>
    </AuthProvider>
  );
};


function App() {
  return (
    <>
      <Helmet>
        <title>Portal Admin - Sistema de Gestão Clínica</title>
        <meta name="description" content="Portal administrativo completo para gerenciamento de clínicas médicas com controle de usuários, agendamentos e integrações." />
        <meta property="og:title" content="Portal Admin - Sistema de Gestão Clínica" />
        <meta property="og:description" content="Portal administrativo completo para gerenciamento de clínicas médicas com controle de usuários, agendamentos e integrações." />
      </Helmet>
      
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;