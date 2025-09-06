import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Bot, UserPlus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const SignUpScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !role) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }
    setIsSubmitting(true);
    await signUp(fullName, email, password, role);
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Cadastro - BotConversa</title>
        <meta name="description" content="Crie uma nova conta no painel BotConversa." />
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
              <CardTitle className="text-3xl font-bold gradient-text">Criar Conta</CardTitle>
              <CardDescription className="text-muted-foreground">Registre um novo atendente</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nome Completo</label>
                  <Input
                    type="text"
                    placeholder="Nome e Sobrenome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-secondary/50 hover:bg-secondary"
                  />
                </div>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Cargo</label>
                  <Select onValueChange={setRole} value={role}>
                    <SelectTrigger className="w-full bg-secondary/50 hover:bg-secondary">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Atendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isSubmitting ? 'Cadastrando...' : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Cadastrar
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground justify-center">
              <p>Já tem uma conta? <Link to="/login" className="text-primary font-semibold hover:underline">Faça login</Link></p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default SignUpScreen;
