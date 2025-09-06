import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Clock, MessageSquare, Calendar } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const newNotification = { 
            ...notification, 
            id: uuidv4(), 
            read: false, 
            timestamp: new Date() 
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);
    
    // Simulação de notificações chegando
    useEffect(() => {
        const interval = setInterval(() => {
            const mockNotifications = [
                {
                    title: "Prazo Vencendo",
                    description: "Relatório Mensal vence em 2 dias.",
                    icon: <Clock className="w-4 h-4 text-yellow-400" />
                },
                {
                    title: "Nova Mensagem",
                    description: "De: Maria Silva - Reagendamento.",
                    icon: <MessageSquare className="w-4 h-4 text-blue-400" />
                },
                {
                    title: "Novo Evento",
                    description: "Consulta de João Carlos amanhã às 10:30.",
                    icon: <Calendar className="w-4 h-4 text-green-400" />
                }
            ];
            const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
            addNotification(randomNotification);
        }, 15000); // Adiciona uma nova notificação a cada 15 segundos

        return () => clearInterval(interval);
    }, [addNotification]);


    const value = { notifications, addNotification, markAsRead };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};