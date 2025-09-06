import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { LogIn, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Login = () => {
  const { user, login } = useAuth();
  const location = useLocation();

  if (user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleLoginRedirect = () => {
    login(); // Agora, a função login redireciona para o portal central
  };

  return (
    <>
      <Helmet>
        <title>Login - Portal Admin Clínica</title>
        <meta name="description" content="Acesse o portal administrativo da clínica médica com suas credenciais." />
        <meta property="og:title" content="Login - Portal Admin Clínica" />
        <meta property="og:description" content="Acesse o portal administrativo da clínica médica com suas credenciais." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-effect rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Activity className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Portal Admin</h1>
              <p className="text-gray-400">Sistema de Gestão Clínica</p>
            </div>

            <div className="text-center space-y-4">
               <p className="text-white">Para continuar, por favor, faça o login através do nosso portal de autenticação central.</p>
                <Button
                    onClick={handleLoginRedirect}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                    <LogIn className="w-5 h-5 mr-2" />
                    Ir para o Portal de Login
                </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-center text-blue-300">
                Você será redirecionado para o portal de login seguro para autenticação.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;