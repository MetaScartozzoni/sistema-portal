import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bot, ExternalLink, Inbox } from 'lucide-react';

const Messages = () => {

  const handleOpenBotPortal = () => {
    // Substitua pela URL real do portal do bot
    window.open('https://bot.marcioplasticsurgery.com', '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Caixa de Entrada</h1>
          <p className="text-slate-400 mt-2">Gerencie suas mensagens e notificações</p>
        </div>
        <Button onClick={handleOpenBotPortal} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Bot className="w-4 h-4 mr-2" />
          Abrir Portal Bot
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-xl p-6 lg:p-12 text-center"
      >
        <Inbox className="w-16 h-16 text-blue-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Módulo de Mensagens em Construção</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Esta área está sendo preparada para unificar todas as suas comunicações, incluindo mensagens de pacientes e alertas do Portal Bot.
        </p>
        <p className="text-slate-400 mt-2 text-sm">
          Em breve, você poderá visualizar, responder e gerenciar tudo por aqui!
        </p>
      </motion.div>
    </div>
  );
};

export default Messages;