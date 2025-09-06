
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider } from '@/contexts/DataContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/screens/LoginScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import MainLayout from '@/components/MainLayout';
import Workspace from '@/screens/Workspace';
import AuditDashboard from '@/screens/AuditDashboard';
import Settings from '@/screens/Settings';
import ConversationHistory from '@/screens/ConversationHistory';
import Contacts from '@/screens/Contacts';
import PublicPortal from '@/screens/PublicPortal';
import IntegrationManual from '@/screens/IntegrationManual';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AnimatePresence } from 'framer-motion';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { session, loading, profile, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="aurora-effect"></div>
        <p className="text-white z-10">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const OpenRoute = ({ children, adminOnly = false }) => {
  const { profile, loading, profileLoading } = useAuth();
  
  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="aurora-effect"></div>
        <p className="text-white z-10">Carregando...</p>
      </div>
    );
  }

  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/portal-secretaria" element={<PublicPortal />} />
        <Route 
          path="/" 
          element={
            <OpenRoute>
              <MainLayout />
            </OpenRoute>
          }
        >
          <Route index element={<Workspace />} />
          <Route path="audit" element={<ProtectedRoute adminOnly={true}><AuditDashboard /></ProtectedRoute>} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="settings" element={<ProtectedRoute adminOnly={true}><Settings /></ProtectedRoute>} />
          <Route path="conversation/:contactId" element={<ConversationHistory />} />
          <Route path="docs/integration" element={<ProtectedRoute adminOnly={true}><IntegrationManual /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

const AppWithProviders = () => (
  <Router>
    <ThemeProvider>
      <HelmetProvider>
        <DataProvider>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </DataProvider>
      </HelmetProvider>
    </ThemeProvider>
  </Router>
);

export default AppWithProviders;
