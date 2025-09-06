
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage';
import PublicPatientRegistrationPage from '@/pages/PublicPatientRegistrationPage';
import { useNotificationSetup } from '@/hooks/useNotificationSetup';
import LoginPage from '@/pages/LoginPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import { useAuth } from '@/contexts/AuthContext';
import UrgentNotificationModal from '@/components/dashboard/notifications/UrgentNotificationModal';
import BudgetResponsePage from '@/pages/BudgetResponsePage';

const ProtectedRoute = ({ children }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-slate-900 text-white">Carregando...</div>;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const UnauthenticatedRoute = ({ children }) => {
  const { profile, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-slate-900 text-white">Carregando...</div>;
  }
  
  if (profile) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  useNotificationSetup();
  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <UnauthenticatedRoute>
              <LoginPage />
            </UnauthenticatedRoute>
          } 
        />
        <Route path="/register" element={<PublicPatientRegistrationPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/budget-response/:patientId" element={<BudgetResponsePage />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Routes>
      <UrgentNotificationModal />
    </>
  );
}

export default App;
