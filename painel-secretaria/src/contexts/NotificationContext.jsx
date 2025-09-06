import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { addDays } from 'date-fns';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [urgentNotification, setUrgentNotification] = useState(null);
  const [settings, setSettings] = useState({
    sound: true,
    visual: true,
  });

  const addNotification = useCallback((notificationData) => {
    const now = new Date();
    let due_date;

    switch (notificationData.priority) {
      case 'urgent':
        due_date = now;
        break;
      case 'tomorrow':
        due_date = addDays(now, 1);
        break;
      case 'weekly':
      default:
        due_date = addDays(now, 7);
        break;
    }

    const newNotification = {
      id: Date.now() + Math.random(),
      read: false,
      created_at: now.toISOString(),
      ...notificationData,
      due_date: due_date.toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

    if (notificationData.priority === 'urgent' && settings.visual) {
      setUrgentNotification(newNotification);
    }
  }, [settings.visual]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const value = useMemo(() => ({
    notifications,
    setNotifications,
    settings,
    setSettings,
    addNotification,
    markAsRead,
    markAllAsRead,
    unreadCount: notifications.filter(n => !n.read).length,
    urgentNotification,
    setUrgentNotification,
  }), [notifications, settings, addNotification, markAsRead, markAllAsRead, urgentNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export { NotificationProvider, useNotificationContext };