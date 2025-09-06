import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Send, Users, X, Mail, MessageSquare, Bot } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

const CommunicationModal = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { users, addLog } = useData();
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('email');

  const getRecipientCount = (group) => {
    switch (group) {
      case 'all':
        return users.length;
      case 'employees':
        return users.filter(u => u.role === 'secretaria' || u.role === 'medico' || u.role === 'admin').length;
      case 'doctors':
        return users.filter(u => u.role === 'medico').length;
      case 'patients_pre_op':
        return users.filter(u => u.role === 'paciente' && u.journeyStatus === 'Em Tratamento').length;
      case 'patients_post_op':
        return users.filter(u => u.role === 'paciente' && u.journeyStatus === 'Aguardando Exames').length;
      case 'patients_discharged':
        return users.filter(u => u.role === 'paciente' && u.journeyStatus === 'Alta').length;
      default:
        return 0;
    }
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Mensagem vazia",
        description: "Por favor, escreva uma mensagem para enviar.",
      });
      return;
    }

    const recipientCount = getRecipientCount(selectedGroup);
    addLog({
        action: `communication.send.${channel}`,
        user: 'Admin',
        description: `Comunicado enviado para ${recipientCount} destinatário(s) do grupo '${selectedGroup}'.`,
        level: 'info'
    });

    toast({
      title: "Comunicado Enviado!",
      description: `Sua mensagem foi enviada via ${channel.toUpperCase()} para ${recipientCount} destinatário(s).`,
    });
    
    // Simulação de envio, informar sobre Supabase
    if (channel === 'email' || channel === 'sms') {
         toast({
            title: "Ação Necessária para Envios Reais!",
            description: "Para enviar e-mails e SMS, precisamos conectar o Supabase. Fale comigo quando quiser fazer a integração!",
            duration: 7000
        });
    }


    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <DialogHeader>
            <DialogTitle className="gradient-text text-2xl flex items-center gap-2">
              <Send />
              Enviar Comunicado
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Envie uma mensagem para grupos específicos de usuários através do canal desejado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">Canal de Comunicação</Label>
               <RadioGroup defaultValue="email" value={channel} onValueChange={setChannel} className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="email" id="r1" className="peer sr-only" />
                  <Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-blue-500">
                    <Mail className="mb-3 h-6 w-6" />
                    E-mail
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="sms" id="r2" className="peer sr-only" />
                  <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-green-500">
                    <MessageSquare className="mb-3 h-6 w-6" />
                    SMS
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="whatsapp" id="r3" className="peer sr-only" />
                  <Label htmlFor="r3" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-purple-500">
                    <Bot className="mb-3 h-6 w-6" />
                    WhatsApp
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">Grupo de Destinatários</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-full bg-white/5 border-white/10">
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="all">Todos os Usuários</SelectItem>
                  <SelectItem value="employees">Funcionários (Médicos, Secretárias, Admin)</SelectItem>
                  <SelectItem value="doctors">Apenas Médicos</SelectItem>
                  <SelectItem value="patients_pre_op">Pacientes Pré-Cirúrgico</SelectItem>
                  <SelectItem value="patients_post_op">Pacientes Pós-Cirúrgico</SelectItem>
                  <SelectItem value="patients_discharged">Pacientes com Alta</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{getRecipientCount(selectedGroup)} destinatários neste grupo.</span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-2 block">Mensagem</Label>
              <Textarea 
                placeholder="Digite sua mensagem aqui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white/5 border-white/10 min-h-[150px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSend} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Send className="w-4 h-4 mr-2" />
              Enviar via {channel.toUpperCase()}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationModal;