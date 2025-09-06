import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Bot } from 'lucide-react';

const NotificationCards = () => {
    const navigate = useNavigate();

    const notifications = [
        {
            title: 'Novas Mensagens do Bot',
            count: 3,
            description: 'Respostas automáticas e solicitações pendentes.',
            icon: Bot,
            color: 'from-blue-500 to-cyan-400',
            path: '/messages'
        },
        {
            title: 'Mensagens de Pacientes',
            count: 5,
            description: 'Dúvidas e solicitações de reagendamento.',
            icon: MessageSquare,
            color: 'from-purple-500 to-pink-500',
            path: '/messages'
        },
        {
            title: 'Próximos Agendamentos',
            count: 2,
            description: 'Consultas agendadas para hoje.',
            icon: Calendar,
            color: 'from-green-500 to-emerald-500',
            path: '/calendar'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div
            className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {notifications.map((notification, index) => (
                <motion.div
                    key={index}
                    variants={itemVariants}
                    className="card-hover cursor-pointer"
                    onClick={() => navigate(notification.path)}
                >
                    <div className="floating-card p-6 flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${notification.color} flex items-center justify-center shrink-0`}>
                            <notification.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-white">{notification.title}</h3>
                                <span className={`px-2 py-1 text-xs font-bold text-white bg-gradient-to-br ${notification.color} rounded-full`}>
                                    {notification.count}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{notification.description}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default NotificationCards;