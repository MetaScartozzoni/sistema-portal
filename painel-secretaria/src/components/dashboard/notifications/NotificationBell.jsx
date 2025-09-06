import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationsPanel from '@/components/dashboard/notifications/NotificationsPanel';
import { useNotificationContext } from '@/contexts/NotificationContext';

const NotificationBell = () => {
  const { notifications } = useNotificationContext();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-white/10"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center bg-red-500 rounded-full"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-96 bg-slate-800/80 backdrop-blur-lg border-white/20 text-white p-0"
        align="end"
      >
        <NotificationsPanel />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;