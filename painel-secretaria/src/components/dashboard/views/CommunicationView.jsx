import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, AlertTriangle, Clock, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'urgent':
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    case 'tomorrow':
      return <Clock className="w-4 h-4 text-yellow-400" />;
    default:
      return <Calendar className="w-4 h-4 text-blue-400" />;
  }
};

const CommunicationView = ({ onSendMessage }) => {
  const { toast } = useToast();
  const { notifications, addNotification } = useNotificationContext();
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [priority, setPriority] = useState('weekly');

  const handleSendInternalMessage = () => {
    if (!recipient || !message) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o destinatário e a mensagem.',
      });
      return;
    }

    addNotification({
      message: `Para ${recipient}: ${message}`,
      type: 'message',
      priority,
      recipient_type: 'employee',
    });

    toast({
      title: 'Mensagem enviada!',
      description: 'A notificação interna foi criada com sucesso.',
    });

    setMessage('');
    setRecipient('');
    setPriority('weekly');
  };

  return (
    <motion.div
      key="communication"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Comunicação</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Notificações Internas Recentes</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getPriorityIcon(notification.priority)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{notification.message}</p>
                    {notification.due_date && (
                       <p className="text-gray-400 text-xs mt-1">
                         Prazo: {formatDistanceToNow(new Date(notification.due_date), { addSuffix: true, locale: ptBR })}
                       </p>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              )) : <p className="text-gray-400">Nenhuma notificação recente.</p>}
            </div>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Enviar Tarefa / Mensagem Interna</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destinatário</label>
                <Input 
                  placeholder="Selecionar funcionário..." 
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mensagem</label>
                <textarea 
                  rows={4} 
                  placeholder="Digite sua mensagem..." 
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prioridade</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Definir prioridade..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20 text-white">
                    <SelectItem value="urgent" className="cursor-pointer hover:!bg-white/10">Urgente</SelectItem>
                    <SelectItem value="tomorrow" className="cursor-pointer hover:!bg-white/10">Amanhã</SelectItem>
                    <SelectItem value="weekly" className="cursor-pointer hover:!bg-white/10">Para Semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" onClick={handleSendInternalMessage}>
                <MessageSquare className="w-4 h-4 mr-2" /> Enviar Mensagem Interna
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default CommunicationView;