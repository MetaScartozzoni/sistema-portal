import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Shield, Calendar, Settings, Puzzle, FileText, FileSignature, X, Activity, FolderCog as CalendarCog, BookOpen, MessageSquare as MessageSquareQuote } from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Usuários', path: '/users' },
    { icon: Shield, label: 'Permissões', path: '/permissions' },
    { icon: Calendar, label: 'Agenda Central', path: '/schedule' },
    { icon: CalendarCog, label: 'Config. Agenda', path: '/calendar-settings' },
    { icon: FileSignature, label: 'Documentos', path: '/documents' },
    { icon: MessageSquareQuote, label: 'Protocolos', path: '/protocols' },
    { icon: Puzzle, label: 'Integrações', path: '/integrations' },
    { icon: FileText, label: 'Logs', path: '/logs' },
    { icon: BookOpen, label: 'Manual de Logs', path: '/logs/manual' },
    { icon: Settings, label: 'Config. Gerais', path: '/settings' }
  ];

  return (
    <div className="h-full sidebar-gradient border-r border-white/10 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Portal Admin</h1>
            <p className="text-xs text-gray-400">Sistema Clínica</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/logs' && location.pathname.startsWith('/logs/'));
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white' 
                    : 'hover:bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'} transition-colors`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-6 bg-blue-400 rounded-full"
                  />
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="glass-effect rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Sistema Online</p>
              <p className="text-xs text-gray-400">Todos os serviços ativos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;