import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DashboardIcon,
  PersonIcon,
  RocketIcon,
  BarChartIcon,
  GearIcon,
  ChatBubbleIcon,
  CalendarIcon,
  IdCardIcon,
  StitchesLogoIcon,
  ExitIcon
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { PortalSwitcher } from '@portal/shared';

const Layout = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/doctor', icon: DashboardIcon },
    { name: 'Agenda', href: '/agenda', icon: CalendarIcon },
    { name: 'Pacientes', href: '/patients', icon: PersonIcon },
    { name: 'Jornada', href: '/journey', icon: RocketIcon },
    { name: 'Mensagens', href: '/messages', icon: ChatBubbleIcon },
    { name: 'Evolução', href: '/evolution', icon: BarChartIcon },
    { name: 'Configurações', href: '/admin/config', icon: GearIcon },
  ];

  // PortalSwitcher cuidará das navegações; botão específico removido

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/95 to-indigo-900">
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/80 backdrop-blur-xl border-r border-slate-700/60">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/60">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg">
              <StitchesLogoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Portal Médico</h1>
              <p className="text-sm text-slate-400">Dr. Márcio Plastic Surgery</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-700/60 space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <PortalSwitcher role={useAuthStore.getState().user?.role} currentCode="medico" />
            </div>
            <Button
              onClick={logout}
              variant="destructive"
              className="w-full bg-red-800/50 hover:bg-red-700/60 border border-red-700/80"
            >
              <ExitIcon className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="pl-64">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="min-h-screen p-8 overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;