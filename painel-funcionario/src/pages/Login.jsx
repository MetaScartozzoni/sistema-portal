import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();

  useEffect(() => {
    login();
  }, [login]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center p-8"
      >
        <div className="flex items-center justify-center space-x-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          <h1 className="text-3xl font-bold text-white">Redirecionando...</h1>
        </div>
        <p className="mt-4 text-gray-400">
          Você está sendo redirecionado para o portal de login centralizado.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;