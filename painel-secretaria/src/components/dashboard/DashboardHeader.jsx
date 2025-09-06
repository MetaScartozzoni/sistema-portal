
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Stethoscope, Share2, HelpCircle, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationBell from '@/components/dashboard/notifications/NotificationBell';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = ({ searchTerm, setSearchTerm, onShareLink, onHelp, title }) => {
  const { profile } = useAuth();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">{title || 'Dashboard'}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar pacientes, médicos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-64"
              />
            </div>
            
            <Button variant="ghost" size="icon" onClick={onShareLink} className="text-white hover:bg-white/10">
              <Share2 className="w-5 h-5" />
            </Button>

            {onHelp && (
              <Button variant="ghost" size="icon" onClick={onHelp} className="text-white hover:bg-white/10">
                <HelpCircle className="w-5 h-5" />
              </Button>
            )}

            <NotificationBell />

            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar_url} alt="Avatar do usuário" />
              <AvatarFallback className="bg-purple-500 text-white">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
