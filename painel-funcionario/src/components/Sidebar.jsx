import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    MessageSquare, 
    ClipboardList, 
    Settings, 
    LogOut,
    Route,
    Contact,
    X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Agenda', path: '/agenda', icon: Calendar },
    { name: 'Jornada', path: '/journey', icon: Route },
    { name: 'Pacientes', path: '/patients', icon: Users },
    { name: 'Contatos', path: '/contacts', icon: Contact },
    { name: 'Mensagens', path: '/messages', icon: MessageSquare },
    { name: 'Prazos', path: '/deadlines', icon: ClipboardList },
    { name: 'Protocolos', path: '/protocols', icon: ClipboardList },
];

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const handleSignOut = () => {
        logout();
    };

    return (
        <div className="h-full bg-slate-900/80 backdrop-blur-sm text-white w-64 flex flex-col p-4 border-r border-white/10">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg"
                    >
                        <LayoutDashboard size={24} />
                    </motion.div>
                    <h1 className="text-2xl font-bold ml-3">Portal</h1>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto scrollbar-thin">
                <ul>
                    {navItems.map((item, index) => (
                        <motion.li 
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            className="mb-2"
                        >
                            <NavLink 
                                to={item.path}
                                className={({ isActive }) => 
                                    `flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/10 ${
                                        (isActive && item.path !== '/') || location.pathname === item.path ? 'bg-blue-600/30 text-white font-semibold' : 'text-gray-400 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="mr-3" size={20} />
                                <span>{item.name}</span>
                            </NavLink>
                        </motion.li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto flex-shrink-0">
                 <NavLink 
                    to="/settings"
                    className={({ isActive }) => 
                        `flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/10 mb-2 ${
                            isActive ? 'bg-blue-600/30 text-white font-semibold' : 'text-gray-400 hover:text-white'
                        }`
                    }
                >
                    <Settings className="mr-3" size={20} />
                    <span>Configurações</span>
                </NavLink>
                <Button variant="ghost" className="w-full justify-start p-3 text-gray-400 hover:text-white hover:bg-red-500/20" onClick={handleSignOut}>
                    <LogOut className="mr-3" size={20} />
                    <span>Sair</span>
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;