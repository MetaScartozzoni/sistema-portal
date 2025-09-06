import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save, Key, User, Upload, Shield } from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth(); // Usando `login` para simular a atualização
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Simulação de atualização. Em um app real, chamaria uma API.
    // Aqui, vamos apenas atualizar o estado local e o localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('admin_user', JSON.stringify(updatedUser));
    // Força a atualização do contexto, como se fosse um novo login
    login(updatedUser.email, 'admin123'); // Usando a senha mockada

    toast({
      title: 'Perfil Atualizado!',
      description: 'Suas informações pessoais foram salvas com sucesso.',
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'As senhas não coincidem. Tente novamente.',
      });
      return;
    }
    if (newPassword.length < 6) {
        toast({
            variant: 'destructive',
            title: 'Senha muito curta!',
            description: 'A nova senha deve ter pelo menos 6 caracteres.',
        });
        return;
    }

    // Simulação de atualização de senha
    toast({
      title: 'Senha Atualizada!',
      description: 'Sua senha foi alterada com sucesso.',
    });
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <Helmet>
        <title>Meu Perfil - Portal Admin</title>
        <meta name="description" content="Visualize e edite suas informações de perfil e altere sua senha." />
      </Helmet>

      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
          <p className="text-gray-400">Gerencie suas informações pessoais e de segurança.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna do Perfil */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>Atualize seu nome e email.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                     <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button size="icon" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600">
                            <Upload className="w-4 h-4"/>
                            <span className="sr-only">Trocar avatar</span>
                        </Button>
                     </div>
                     <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                     <p className="text-sm text-purple-400 font-medium bg-purple-500/10 px-3 py-1 rounded-full capitalize">{user.role}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Nome Completo</Label>
                      <Input id="name" value={formData.name} onChange={handleInputChange} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Endereço de Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Coluna da Senha */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Segurança
                </CardTitle>
                <CardDescription>Altere sua senha de acesso.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                    <Key className="w-4 h-4 mr-2" />
                    Atualizar Senha
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;