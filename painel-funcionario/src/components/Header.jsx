import React from 'react';
import { motion } from 'framer-motion';
import { Search, User, Plus, Calendar, MessageSquare, LogOut, Menu } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import NotificationBell from '@/components/NotificationBell';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const { toast } = useToast();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleFeatureClick = (feature) => {
    toast({
      title: `✨ ${feature}`,
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect p-4 sticky top-0 z-30 flex-shrink-0"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="lg:hidden text-white p-2 -ml-2">
                <Menu />
            </button>
            <div className="hidden md:block flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                    type="text"
                    placeholder="Buscar pacientes, eventos..."
                    className="input-field pl-10 w-full"
                    onClick={() => handleFeatureClick("Busca Global")}
                    readOnly
                    />
                </div>
            </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="btn-primary hidden md:flex"><Plus className="w-4 h-4 mr-2" /> Criar Novo</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => navigate('/agenda')}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Novo Agendamento</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/patients')}>
                <User className="mr-2 h-4 w-4" />
                <span>Novo Paciente</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/messages')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Nova Mensagem</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center space-x-3 glass-effect rounded-lg p-2 hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium truncate max-w-[120px]">{user?.email || 'Usuário'}</p>
                  <p className="text-xs text-gray-400">{user?.role || 'Secretaria'}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              {isAuthenticated && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;