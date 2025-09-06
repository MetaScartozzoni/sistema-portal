import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { CheckCheck, BellOff, Settings, Volume2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotificationContext } from '@/contexts/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationsPanel = () => {
  const { notifications, markAllAsRead, settings, setSettings } = useNotificationContext();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h3 className="font-semibold text-white">Notificações</h3>
        {notifications.some(n => !n.read) && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-gray-300 hover:text-white hover:bg-white/10">
            <CheckCheck className="w-4 h-4 mr-1" />
            Marcar todas como lidas
          </Button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        <AnimatePresence>
          {notifications.length > 0 ? (
            notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
          ) : (
            <div className="text-center p-8 text-gray-400">
              <BellOff className="mx-auto h-8 w-8 mb-2" />
              Nenhuma notificação por aqui.
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4 border-t border-white/20">
        <h4 className="font-semibold text-white mb-3 flex items-center"><Settings className="w-4 h-4 mr-2"/>Configurações</h4>
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label htmlFor="visual-switch" className="text-gray-300 flex items-center cursor-pointer">
                    <Bell className="w-4 h-4 mr-2"/> Notificações Pop-up
                </Label>
                <Switch 
                    id="visual-switch"
                    checked={settings.visual}
                    onCheckedChange={(checked) => setSettings(s => ({...s, visual: checked}))}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="sound-switch" className="text-gray-300 flex items-center cursor-pointer">
                    <Volume2 className="w-4 h-4 mr-2"/> Alertas Sonoros
                </Label>
                <Switch 
                    id="sound-switch"
                    checked={settings.sound}
                    onCheckedChange={(checked) => setSettings(s => ({...s, sound: checked}))}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;