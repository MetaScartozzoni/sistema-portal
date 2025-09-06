import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';

const SystemMessageModal = ({ open, onOpenChange, messageItem }) => {
  const handleAction = () => {
    // Placeholder for future integration
    alert(`Ação para a mensagem: "${messageItem?.description}"`);
  };

  if (!messageItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/10 text-white sm:max-w-[550px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <DialogHeader>
            <DialogTitle className="gradient-text text-2xl flex items-center gap-2">
              <MessageSquare />
              {messageItem.description}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Este é um modelo de mensagem do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white">{messageItem.content}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAction} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Send className="w-4 h-4 mr-2" />
              Usar Mensagem
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SystemMessageModal;