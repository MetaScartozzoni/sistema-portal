import React from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Users, MessageSquare, History, Lightbulb, X } from 'lucide-react';

const HelpDialog = ({ open, onOpenChange }) => {
  if (!open) return null;

  const helpSections = [
    {
      icon: Calendar,
      title: 'Gerenciando o Calendário',
      content: 'O calendário é o coração da clínica. Clique em um dia para ver os horários disponíveis à direita. Slots coloridos indicam o tipo de atendimento. Para agendar, clique em um slot "Disponível". Para ver detalhes, clique em um agendamento existente.',
    },
    {
      icon: Users,
      title: 'Cadastro e Ações de Pacientes',
      content: 'Na aba "Pacientes", você vê todos os cadastrados. Clique em um paciente para abrir o painel de ações, onde você pode enviar documentos, solicitar exames ou iniciar um contato rápido via WhatsApp ou ligação.',
    },
    {
      icon: MessageSquare,
      title: 'Comunicação Interna',
      content: 'Use a aba "Comunicação" para enviar recados para médicos e outros membros da equipe. Todas as notificações importantes também aparecerão lá e no sino de notificações no canto superior direito.',
    },
    {
      icon: History,
      title: 'Trilha de Auditoria',
      content: 'A aba "Auditoria" registra todas as ações importantes realizadas no sistema, como criação de agendamentos, envio de documentos e alterações. É a sua fonte de verdade para rastrear tudo o que acontece.',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-purple-500/30 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-300" />
              <h3 className="text-2xl font-bold text-white">Guia Rápido da Secretaria</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {helpSections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="p-2 bg-purple-500/20 rounded-full mt-1">
                    <section.icon className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-white">{section.title}</h4>
                    <p className="text-gray-300 text-sm mt-1">{section.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default HelpDialog;