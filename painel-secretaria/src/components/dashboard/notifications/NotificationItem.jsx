
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { AlertTriangle, Calendar, CheckCircle, Info, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getIcon = (type, priority) => {
  if (priority === 'urgent') return <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />;
  if (priority === 'tomorrow') return <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />;
  
  switch (type) {
    case 'appointment_created':
    case 'appointment_updated':
    case 'appointment_cancelled':
      return <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />;
    case 'patient_created':
      return <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />;
    default:
      return <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />;
  }
};

const NotificationItem = ({ notification }) => {
  const { markAsRead } = useNotificationContext();

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();
    markAsRead(notification.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "flex items-start space-x-3 p-3 transition-colors",
        !notification.read && "bg-purple-500/10",
        notification.priority === 'urgent' && !notification.read && "bg-red-500/20"
      )}
    >
      <div className="mt-1">
        {getIcon(notification.type, notification.priority)}
      </div>
      <div className="flex-1">
        <p className="text-white text-sm leading-snug">{notification.message}</p>
        <p className="text-gray-400 text-xs mt-1.5">
          {notification.due_date 
            ? `Prazo: ${formatDistanceToNow(new Date(notification.due_date), { addSuffix: true, locale: ptBR })}`
            : new Date(notification.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
          }
        </p>
      </div>
      {!notification.read && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 h-auto p-1.5 rounded-full"
          onClick={handleMarkAsRead}
        >
          <CheckCircle className="w-4 h-4"/>
        </Button>
      )}
    </motion.div>
  );
};

export default NotificationItem;
