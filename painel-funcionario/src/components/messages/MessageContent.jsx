import React from 'react';
import { Bot, Clock, Paperclip, User, Star, Archive, Trash2, Send } from 'lucide-react';
import { CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const MessageContent = ({ message }) => {
  const { toast } = useToast();

  const handleFeatureClick = (feature) => {
    toast({
      title: `💬 ${feature}`,
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'patient': return <User className="w-6 h-6" />;
      case 'doctor': return '👨‍⚕️';
      case 'lab': return '🔬';
      case 'insurance': return '🏥';
      case 'bot': return <Bot className="w-6 h-6 text-cyan-400" />;
      default: return '📧';
    }
  };

  if (!message) return null;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="text-2xl w-6 h-6 flex items-center justify-center">{getMessageTypeIcon(message.type)}</div>
            <div>
              <CardTitle className="text-lg">{message.subject}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-400">
                <div className="flex items-center space-x-1"><User className="w-4 h-4" /><span>{message.from}</span></div>
                <div className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>{new Date(message.timestamp).toLocaleString('pt-BR')}</span></div>
                {message.priority === 'urgent' && <span className="status-badge status-urgent">Urgente</span>}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="icon" variant="outline" onClick={() => handleFeatureClick('Favoritar')}><Star className="w-4 h-4" /></Button>
            <Button size="icon" variant="outline" onClick={() => handleFeatureClick('Arquivar')}><Archive className="w-4 h-4" /></Button>
            <Button size="icon" variant="outline" onClick={() => handleFeatureClick('Excluir')}><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-grow">
        <CardContent className="pt-0">
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          {message.hasAttachment && (
            <div className="mt-6 p-4 glass-effect rounded-lg">
              <div className="flex items-center space-x-2">
                <Paperclip className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Anexo: relatorio_exames.pdf</span>
                <Button size="sm" variant="outline" onClick={() => handleFeatureClick('Baixar Anexo')}>Baixar</Button>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>

      <CardFooter className="border-t border-white/10 flex-shrink-0">
        <div className="flex space-x-2">
          <Button className="btn-primary" onClick={() => handleFeatureClick('Responder')}><Send className="w-4 h-4 mr-2" />Responder</Button>
          <Button variant="outline" onClick={() => handleFeatureClick('Encaminhar')}>Encaminhar</Button>
        </div>
      </CardFooter>
    </div>
  );
};

export default MessageContent;