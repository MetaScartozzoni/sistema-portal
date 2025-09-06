// pages/Settings.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

import { Settings as SettingsIcon, Bell, User, Palette, Lock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleFeatureClick = (feature) => {
    toast({
      title: `⚙️ ${feature}`,
      description:
        "🚧 Esta funcionalidade ainda não foi implementada — mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  const settingsOptions = [
    {
      icon: User,
      title: 'Perfil',
      description: 'Atualize suas informações pessoais e foto.',
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Escolha como e quando você será notificado.',
    },
    {
      icon: Palette,
      title: 'Aparência',
      description: 'Personalize o tema e a aparência do portal.',
    },
    {
      icon: Lock,
      title: 'Segurança',
      description: 'Altere sua senha e gerencie a segurança da conta.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Configurações - Portal Secretaria</title>
        <meta
          name="description"
          content="Gerencie as configurações do seu perfil, notificações e aparência do portal."
        />
      </Helmet>

      <div className="space-y-8">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" />
            Configurações
          </h1>
          <p className="text-gray-400">
            Gerencie as preferências da sua conta e do portal.
          </p>
        </motion.div>

        {/* Cards de configuração */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Card className="card-hover h-full">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>{option.title}</CardTitle>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => handleFeatureClick(option.title)}
                    aria-label={`Gerenciar ${option.title}`}
                  >
                    Gerenciar {option.title}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Settings;