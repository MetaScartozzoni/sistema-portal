
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';
import { useNotificationContext } from '@/contexts/NotificationContext';

const UrgentNotificationModal = () => {
  const { urgentNotification, setUrgentNotification, markAsRead } = useNotificationContext();

  const handleClose = () => {
    if (urgentNotification) {
      markAsRead(urgentNotification.id); 
      setUrgentNotification(null);
    }
  };

  return (
    <AnimatePresence>
      {urgentNotification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-slate-800/80 border border-red-500/50 rounded-2xl shadow-2xl p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 p-3 rounded-full border-4 border-slate-800">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Notificação Urgente!</h2>
            
            <p className="text-gray-300 mb-8 text-lg">
              {urgentNotification.message}
            </p>

            <Button 
              onClick={handleClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              <X className="w-5 h-5 mr-2" /> Fechar e Marcar como Lida
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UrgentNotificationModal;
