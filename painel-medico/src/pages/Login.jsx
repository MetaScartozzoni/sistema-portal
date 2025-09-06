import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { StitchesLogoIcon, EnterIcon } from '@radix-ui/react-icons';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard/doctor');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/95 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md text-center"
      >
        <div className="glass-effect rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg">
              <StitchesLogoIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Portal do Médico</h1>
          <p className="text-slate-400 mb-8">
            Acesse o sistema através do portal administrativo central.
          </p>
          
          <Button 
            onClick={login}
            variant="shine"
            size="lg"
            className="w-full text-lg"
          >
            <EnterIcon className="w-5 h-5 mr-2" />
            Acessar Portal
          </Button>

          <p className="text-xs text-slate-500 mt-8">
            Você será redirecionado para o portal de autenticação central. Após o login, você retornará para esta página.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;