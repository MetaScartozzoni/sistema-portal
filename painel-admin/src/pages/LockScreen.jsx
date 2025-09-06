import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { KeyRound, LogIn, Power } from 'lucide-react';

const LockScreen = () => {
  const { user, unlockSession, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const DEMO_PIN = import.meta?.env?.VITE_LOCK_PIN || '1234';

  const handleSubmit = (e) => {
    e.preventDefault();
    // unlockSession internamente valida, mas garantimos fallback demo
    if (unlockSession(pin) || pin === DEMO_PIN) {
      toast({
        title: 'Sessão Desbloqueada!',
        description: 'Bem-vindo de volta.',
      });
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError('PIN incorreto. Tente novamente.');
      setPin('');
      toast({
        variant: 'destructive',
        title: 'PIN Incorreto',
        description: 'O PIN inserido está incorreto. Por favor, tente novamente.',
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Sessão Bloqueada - Portal Admin</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="glass-effect rounded-2xl p-8 shadow-2xl text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400 mb-6">Sua sessão está bloqueada por inatividade.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Digite seu PIN para desbloquear"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (error) setError('');
                  }}
                  className={`pl-10 text-center tracking-[0.5em] bg-white/5 border-white/10 placeholder-gray-500 ${error ? 'border-red-500 ring-red-500' : ''}`}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Desbloquear
              </Button>
            </form>

            <div className="mt-6">
                <Button variant="link" className="text-gray-400 hover:text-white" onClick={logout}>
                    <Power className="w-4 h-4 mr-2" />
                    Não é você? Sair
                </Button>
            </div>
            
            {import.meta?.env?.VITE_DEV_MODE === 'true' && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-center text-yellow-300">
                  PIN de desenvolvimento configurado em VITE_LOCK_PIN (atual: {DEMO_PIN}).
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LockScreen;