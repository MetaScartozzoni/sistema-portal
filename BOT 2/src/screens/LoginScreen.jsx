import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Bot, LogIn } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, session, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (session) {
      navigate(from, { replace: true });
    }
  }, [session, navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o e-mail e a senha.",
      });
      return;
    }
    setIsSubmitting(true);
    await signIn(email, password);
    setIsSubmitting(false);
  };
  
  if (authLoading && !session) {
     return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="aurora-effect"></div>
        <p className="text-white z-10">Verificando sessão...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login - BotConversa</title>
        <meta name="description" content="Acesse o painel BotConversa para gerenciar seus atendimentos." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
        <div className="aurora-effect opacity-100"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative z-10"
        >
          <Card className="w-full max-w-md glass-effect-strong">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-primary to-purple-500 rounded-2xl shadow-lg inline-block">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold gradient-text">BotConversa</CardTitle>
              <CardDescription className="text-muted-foreground">Acesse com suas credenciais</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary/50 hover:bg-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Senha</label>
                   <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/50 hover:bg-secondary"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isSubmitting ? 'Entrando...' : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar no Painel
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
             <CardFooter className="text-center text-sm text-muted-foreground justify-center">
                <p>Não tem uma conta? <Link to="/signup" className="text-primary font-semibold hover:underline">Cadastre-se</Link></p>
             </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginScreen;
