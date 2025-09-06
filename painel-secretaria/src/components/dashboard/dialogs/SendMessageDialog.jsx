import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const SendMessageDialog = ({ open, onOpenChange, onSubmit }) => {
  const { toast } = useToast();
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [internalUsers, setInternalUsers] = useState([]);

  useEffect(() => {
    const fetchInternalUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, app_role')
        .in('app_role', ['admin', 'medico', 'secretaria']);

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar usuários',
          description: error.message,
        });
      } else {
        setInternalUsers(data);
      }
    };

    if (open) {
      fetchInternalUsers();
    }
  }, [open, toast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipientId || !message) return;
    onSubmit({
      recipient_id: recipientId,
      message: message,
    });
    setMessage('');
    setRecipientId('');
  };

  const recipientOptions = internalUsers.map(user => ({
    value: user.id,
    label: `${user.full_name} (${user.app_role})`,
  }));

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Enviar Recado Interno</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Destinatário</Label>
                <Combobox
                  options={recipientOptions}
                  value={recipientId}
                  onChange={setRecipientId}
                  placeholder="Selecione um destinatário"
                  searchPlaceholder="Buscar por nome ou cargo..."
                  emptyPlaceholder="Nenhum usuário encontrado."
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">Mensagem</Label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Digite sua mensagem..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button type="button" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                Enviar Recado
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default SendMessageDialog;