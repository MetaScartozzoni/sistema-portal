import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import Calendar from '@/pages/Calendar';
import Deadlines from '@/pages/Deadlines';
import Messages from '@/pages/Messages';
import Protocols from '@/pages/Protocols';
import PatientJourney from '@/pages/PatientJourney';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Callback from '@/pages/Callback';
import Contacts from '@/pages/Contacts';
import { Toaster } from '@/components/ui/toaster';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ApiProvider } from '@/contexts/ApiContext';
import { AuthProvider } from '@/contexts/AuthContext';

const AppContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/50 text-white">
      <Routes>
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/callback" element={<Callback />} />
        <Route 
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/agenda" element={<Calendar />} />
                <Route path="/journey" element={<PatientJourney />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/deadlines" element={<Deadlines />} />
                <Route path="/protocols" element={<Protocols />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Portal Secretaria - Módulo Secretary</title>
        <meta name="description" content="Sistema modular de gestão para secretarias médicas - Módulo Secretary para gestão de pacientes, calendário, prazos e mensagens" />
        <meta property="og:title" content="Portal Secretaria - Módulo Secretary" />
        <meta property="og:description" content="Sistema modular de gestão para secretarias médicas - Módulo Secretary para gestão de pacientes, calendário, prazos e mensagens" />
      </Helmet>
      <AuthProvider>
        <ApiProvider>
          <NotificationProvider>
            <AppContent />
            <Toaster />
          </NotificationProvider>
        </ApiProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;