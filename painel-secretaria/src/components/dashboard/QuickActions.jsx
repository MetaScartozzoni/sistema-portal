
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, X, CalendarPlus, UserPlus, MessageSquare, Download, Contact } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

const QuickActions = ({ onNewAppointment, onNewPatient, onNewContact, onSendMessage }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef(null);

  useOnClickOutside(fabRef, () => setIsOpen(false));

  const actions = [
    {
      label: 'Novo Agendamento',
      icon: CalendarPlus,
      action: onNewAppointment,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Novo Contato',
      icon: Contact,
      action: onNewContact,
      color: 'bg-teal-500 hover:bg-teal-600',
    },
    {
      label: 'Cadastrar Paciente',
      icon: UserPlus,
      action: onNewPatient,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Enviar Recado',
      icon: MessageSquare,
      action: onSendMessage,
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      label: 'Exportar Lista',
      icon: Download,
      action: () => toast({ title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" }),
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
  ];

  const handleActionClick = (action) => {
    action();
    setIsOpen(false);
  };
  
  const fabVariants = {
    open: { rotate: 45 },
    closed: { rotate: 0 }
  };

  const menuVariants = {
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const arcItemVariants = {
    open: (i) => {
      const angle = -15 - i * 30;
      return {
        transform: `rotate(${angle}deg) translateY(-80px) rotate(${-angle}deg)`,
        opacity: 1,
        transition: { type: 'spring', stiffness: 260, damping: 20, delay: i * 0.05 },
      };
    },
    closed: {
      transform: 'rotate(0deg) translateY(0px) rotate(0deg)',
      opacity: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
  };


  return (
    <div ref={fabRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative"
            style={{ width: '100px', height: '100px' }}
          >
            {actions.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={arcItemVariants}
                className="absolute top-1/2 left-1/2"
                style={{ transformOrigin: 'center' }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        onClick={() => handleActionClick(item.action)}
                        className={`w-12 h-12 rounded-full shadow-lg ${item.color}`}
                      >
                        <item.icon className="w-6 h-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-slate-800 text-white border-white/20">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full shadow-2xl relative z-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <motion.div variants={fabVariants} animate={isOpen ? 'open' : 'closed'}>
          {isOpen ? <X className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
        </motion.div>
      </Button>
    </div>
  );
};

export default QuickActions;