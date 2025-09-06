import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ConversationHistory = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const { messages, contacts, loading, addLogEntry, addMessage } = useData();
  const [newMessage, setNewMessage] = useState('');
  
  const contact = contacts.find(c => c.id === contactId);
  const conversationMessages = messages
    .filter(m => m.contact_id === contactId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !session?.user) return;

    const messageData = {
      content: newMessage,
      contact_id: contactId,
      from_contact: false,
      user_id: session.user.id,
      channel: 'internal',
      status: 'sent',
      priority: 'media'
    };

    addMessage(messageData);
    addLogEntry('Mensagem Enviada', { to: contact?.full_name, message: newMessage });
    setNewMessage('');
    toast({
      title: "🚀 Mensagem Enviada!",
      description: "Sua resposta foi registrada no histórico local.",
    });
  };
  
  if (loading) {
     return <div className="text-center p-10">Carregando histórico...</div>;
  }
  
  if (!contact) {
      return (
          <div className="text-center p-10">
              <h2 className="text-2xl font-bold">Contato não encontrado</h2>
              <p>O contato que você está tentando acessar não existe.</p>
              <Button onClick={() => navigate('/')} className="mt-4">Voltar para o Início</Button>
          </div>
      );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect-strong text-white h-[75vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button variant="glass" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                {contact?.full_name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-white">{contact.full_name}</CardTitle>
              <CardDescription className="text-gray-300">{contact.phone}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-4">
          {conversationMessages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${!msg.from_contact ? 'justify-end' : 'justify-start'}`}>
              {msg.from_contact && <User className="h-6 w-6 text-gray-400 self-end" />}
              <div className={`max-w-md p-3 rounded-lg ${!msg.from_contact ? 'bg-blue-600/80' : 'bg-white/20'}`}>
                <p className="text-sm text-white">{msg.content}</p>
                <p className="text-xs text-gray-300 mt-1 text-right">{formatTime(msg.created_at)}</p>
              </div>
              {!msg.from_contact && <Bot className="h-6 w-6 text-blue-400 self-end" />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t border-white/20 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Input 
              placeholder="Digite sua resposta..." 
              className="bg-white/10 text-white border-white/20 placeholder:text-gray-400"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="glassPrimary" onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ConversationHistory;