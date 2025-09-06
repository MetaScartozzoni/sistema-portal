// components/messages/NewMessageDialog.jsx

import React from 'react';
import { Paperclip, Send } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const NewMessageDialog = () => {
  const { toast } = useToast();

  const handleFeatureClick = (feature) => {
    toast({
      title: `💬 ${feature}`,
      description: "🚧 Esta funcionalidade ainda não foi implementada — mas você pode solicitá-la no próximo prompt! 🚀"
    });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Compor Nova Mensagem</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div>
          <label className="block text-sm font-medium mb-1">Para</label>
          <Input placeholder="Digite o destinatário..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assunto</label>
          <Input placeholder="Digite o assunto..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mensagem</label>
          <textarea
            className="input-field w-full h-32 resize-none"
            placeholder="Digite sua mensagem..."
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleFeatureClick('Anexar Arquivo')}>
              <Paperclip className="w-4 h-4 mr-1" />
              Anexar
            </Button>
            <select className="input-field">
              <option value="normal">Prioridade Normal</option>
              <option value="high">Alta Prioridade</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => handleFeatureClick('Cancelar')}>
          Cancelar
        </Button>
        <Button className="btn-primary" onClick={() => handleFeatureClick('Enviar Mensagem')}>
          <Send className="w-4 h-4 mr-2" />
          Enviar
        </Button>
      </div>
    </DialogContent>
  );
};

export default NewMessageDialog;