
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '@/App';
import '@/index.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ScheduleConfigProvider } from '@/contexts/ScheduleConfigContext';
import EnvWarningBanner from '@/components/EnvWarningBanner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <ScheduleConfigProvider>
              <ToastProvider>
                <EnvWarningBanner />
                <App />
                <Toaster />
              </ToastProvider>
            </ScheduleConfigProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
