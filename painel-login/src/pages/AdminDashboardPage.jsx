import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboardPage = () => {
  const { toast } = useToast();

  const showNotImplementedToast = () => {
    toast({
      title: "Funcionalidade Indisponível",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      variant: "default"
    });
  };

  return (
    <>
      <Helmet>
        <title>Painel do Administrador</title>
        <meta name="description" content="Painel de controle exclusivo para administradores." />
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-500/20 rounded-full p-3 w-fit mb-4">
                <Shield className="w-8 h-8 text-blue-300" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Painel do Administrador
              </CardTitle>
              <CardDescription className="text-gray-300">
                Bem-vindo(a)! (E-mail do usuário não disponível sem autenticação)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-8 p-8">
              <p className="text-lg text-gray-200">
                Você tem acesso total ao sistema.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={showNotImplementedToast}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sair
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
