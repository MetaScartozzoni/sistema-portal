import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, LogIn, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await signIn(email, password);
    if (error) {
      toast({
        variant: "destructive",
        title: "Falha no Login",
        description: "Verifique seu e-mail e senha e tente novamente.",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Login bem-sucedido!",
      description: "Redirecionando para o dashboard...",
    });

    const userRole = data?.profile?.app_role;
    const from = location.state?.from?.pathname || null;

    if (userRole === 'admin') {
      navigate('/secretary', { replace: true });
    } else if (['comercial', 'admin_financeiro'].includes(userRole)) {
      navigate('/secretary', { replace: true });
    } else if (userRole === 'medico') {
      navigate(from || '/', { replace: true });
    } else {
      navigate('/', { replace: true });
    }

    // O setLoading não será setado para false aqui para evitar piscar a tela
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl"
      >
        <div className="text-center">
          <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Bem-vindo de volta!</h1>
          <p className="text-gray-300 mt-2">Acesse o painel da sua clínica.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-purple-500"
            />
          </div>
          <div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;