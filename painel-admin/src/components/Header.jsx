import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, LogOut, User as UserIcon, CheckCheck, ExternalLink } from 'lucide-react';
import { PortalSwitcher } from '@portal/shared';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationsAsRead, markAllAsRead } = useData();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    markNotificationsAsRead([notification.id]);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <header className="glass-effect border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar no sistema..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 w-64"
              />
            </div>
          </div>
        </div>

  <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white border-2 border-slate-800">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-800/80 backdrop-blur-lg border-slate-700 text-white">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notificações</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" onClick={markAllAsRead}>
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Marcar todas como lidas
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700"/>
              {notifications.length > 0 ? notifications.slice(0, 5).map(n => (
                <DropdownMenuItem key={n.id} onSelect={() => handleNotificationClick(n)} className={`flex items-start gap-3 ${!n.read && 'bg-blue-500/10'}`}>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>}
                  <div className={n.read ? 'pl-5' : ''}>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-xs text-gray-400">{n.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(n.timestamp), { addSuffix: true, locale: ptBR })}</p>
                  </div>
                </DropdownMenuItem>
              )) : <p className="text-xs text-center text-gray-400 py-4">Nenhuma notificação nova.</p>}
            </DropdownMenuContent>
          </DropdownMenu>

          <PortalSwitcher role={user?.role} currentCode="admin" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800/80 backdrop-blur-lg border-slate-700 text-white">
              <DropdownMenuItem onSelect={() => navigate('/profile')} className="focus:bg-slate-700">
                <UserIcon className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700"/>
              <DropdownMenuItem onSelect={logout} className="text-red-400 hover:!text-red-300 focus:!bg-red-500/10">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;