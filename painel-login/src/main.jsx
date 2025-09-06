
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
// Removido o AuthProvider, pois a integração Supabase foi desconectada.
// Se precisar de autenticação, uma nova solução precisará ser integrada aqui.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);