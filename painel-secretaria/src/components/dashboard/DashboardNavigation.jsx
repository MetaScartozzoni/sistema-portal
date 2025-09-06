import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, MessageSquare, Calendar, History } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'communication', label: 'Comunicação', icon: MessageSquare },
  { id: 'auditoria', label: 'Auditoria', icon: History },
];

const DashboardNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white/5 backdrop-blur-sm border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex space-x-8 py-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default DashboardNavigation;