import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getMockUsers,
  getMockRoles,
  getMockSchedules,
  getMockIntegrations,
  getMockLogs,
  getMockSettings,
  getMockDocuments,
  getMockCalendarSettings,
  getMockPatientJourney,
  getMockLogsManual,
  getMockNotifications
} from '@/data';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [calendarSettings, setCalendarSettings] = useState(null);
  const [patientJourney, setPatientJourney] = useState(null);
  const [logsManual, setLogsManual] = useState(null);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    const storedUsers = localStorage.getItem('clinic_users');
    const storedRoles = localStorage.getItem('clinic_roles');
    const storedSchedules = localStorage.getItem('clinic_schedules');
    const storedIntegrations = localStorage.getItem('clinic_integrations');
    const storedLogs = localStorage.getItem('clinic_logs');
    const storedSettings = localStorage.getItem('clinic_settings');
    const storedDocuments = localStorage.getItem('clinic_documents');
    const storedCalendarSettings = localStorage.getItem('clinic_calendar_settings');
    const storedPatientJourney = localStorage.getItem('clinic_patient_journey');
    const storedLogsManual = localStorage.getItem('clinic_logs_manual');
    const storedNotifications = localStorage.getItem('clinic_notifications');

    setUsers(storedUsers ? JSON.parse(storedUsers) : getMockUsers());
    const initialRoles = storedRoles ? JSON.parse(storedRoles) : getMockRoles();
    setRoles(initialRoles);
    setSchedules(storedSchedules ? JSON.parse(storedSchedules) : getMockSchedules());
    setIntegrations(storedIntegrations ? JSON.parse(storedIntegrations) : getMockIntegrations());
    setLogs(storedLogs ? JSON.parse(storedLogs) : getMockLogs());
    setSettings(storedSettings ? JSON.parse(storedSettings) : getMockSettings());
    setDocuments(storedDocuments ? JSON.parse(storedDocuments) : getMockDocuments());
    setCalendarSettings(storedCalendarSettings ? JSON.parse(storedCalendarSettings) : getMockCalendarSettings());
    setPatientJourney(storedPatientJourney ? JSON.parse(storedPatientJourney) : getMockPatientJourney());
    setLogsManual(storedLogsManual ? JSON.parse(storedLogsManual) : getMockLogsManual());
    setNotifications(storedNotifications ? JSON.parse(storedNotifications) : getMockNotifications());
  };

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  const addNotification = (notificationData) => {
    const newNotification = {
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationData,
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    saveToStorage('clinic_notifications', updatedNotifications);
  };

  const markNotificationsAsRead = (ids) => {
    const updatedNotifications = notifications.map(n => 
      ids.includes(n.id) ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    saveToStorage('clinic_notifications', updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    saveToStorage('clinic_notifications', updatedNotifications);
  }

  const addUser = (userData) => {
    const roleData = roles.find(r => r.name === userData.role);
    const newUser = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      avatar: `https://avatar.vercel.sh/${userData.email}.png`,
      status: 'active',
      permissions: roleData ? roleData.permissions : []
    };
    if (newUser.role === 'contact') {
        newUser.journeyStatus = 'Triagem';
    }
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage('clinic_users', updatedUsers);
    addNotification({
        title: 'Novo Usuário Criado',
        description: `${newUser.name} foi adicionado como ${newUser.role}.`,
        link: `/users`
    });
  };

  const updateUser = (userId, userData) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    );
    setUsers(updatedUsers);
    saveToStorage('clinic_users', updatedUsers);
  };
  
  const addSchedule = (scheduleData) => {
    let updatedUsers = [...users];
    const userToUpdate = updatedUsers.find(u => u.id === scheduleData.participantIds[0]);

    if (userToUpdate && userToUpdate.role === 'contact' && scheduleData.type === 'Consulta') {
        userToUpdate.role = 'paciente';
        const patientRole = roles.find(r => r.name === 'paciente');
        userToUpdate.permissions = patientRole ? patientRole.permissions : [];
        setUsers(updatedUsers);
        saveToStorage('clinic_users', updatedUsers);
    }
    
    const newSchedule = {
      ...scheduleData,
      id: Date.now().toString(),
      status: 'confirmed',
    };
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    saveToStorage('clinic_schedules', updatedSchedules);
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveToStorage('clinic_users', updatedUsers);
  };

  const addRole = (roleData) => {
    const newRole = {
      ...roleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    saveToStorage('clinic_roles', updatedRoles);
  };

  const updateRole = (roleId, roleData) => {
    const updatedRoles = roles.map(role => 
      role.id === roleId ? { ...role, ...roleData } : role
    );
    setRoles(updatedRoles);
    saveToStorage('clinic_roles', updatedRoles);
  };

  const deleteRole = (roleId) => {
    const updatedRoles = roles.filter(role => role.id !== roleId);
    setRoles(updatedRoles);
    saveToStorage('clinic_roles', updatedRoles);
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveToStorage('clinic_settings', updatedSettings);
  };

  const updateDocuments = (newDocuments) => {
    const updatedDocuments = { ...documents, ...newDocuments };
    setDocuments(updatedDocuments);
    saveToStorage('clinic_documents', updatedDocuments);
  };

  const addDocument = (section, docData) => {
    const newDoc = {
      ...docData,
      id: Date.now().toString(),
      lastModified: new Date().toISOString()
    };
    const updatedSection = [...documents[section], newDoc];
    const updatedDocuments = { ...documents, [section]: updatedSection };
    setDocuments(updatedDocuments);
    saveToStorage('clinic_documents', updatedDocuments);
  };
  
  const updateDocument = (section, docId, docData) => {
    const updatedSection = documents[section].map(doc => 
      doc.id === docId ? { ...doc, ...docData, lastModified: new Date().toISOString() } : doc
    );
    const updatedDocuments = { ...documents, [section]: updatedSection };
    setDocuments(updatedDocuments);
    saveToStorage('clinic_documents', updatedDocuments);
  };

  const deleteDocument = (section, docId) => {
    const updatedSection = documents[section].filter(doc => doc.id !== docId);
    const updatedDocuments = { ...documents, [section]: updatedSection };
    setDocuments(updatedDocuments);
    saveToStorage('clinic_documents', updatedDocuments);
  };

  const updateCalendarSettings = (newCalendarSettings) => {
    const updatedSettings = { ...calendarSettings, ...newCalendarSettings };
    setCalendarSettings(updatedSettings);
    saveToStorage('clinic_calendar_settings', updatedSettings);
  };

  const addLog = (logData) => {
    const newLog = {
      ...logData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...logs].slice(0, 1000);
    setLogs(updatedLogs);
    saveToStorage('clinic_logs', updatedLogs);
  };

  const updatePatientJourney = (newJourney) => {
      setPatientJourney(newJourney);
      saveToStorage('clinic_patient_journey', newJourney);
  };

  const updateIntegration = (integrationId, data) => {
    const updatedIntegrations = integrations.map(int => 
      int.id === integrationId ? { ...int, ...data } : int
    );
    setIntegrations(updatedIntegrations);
    saveToStorage('clinic_integrations', updatedIntegrations);
  };

  const updateProtocols = (newProtocols) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        protocols: newProtocols,
      },
    };
    setSettings(newSettings);
    saveToStorage('clinic_settings', newSettings);
  }

  const value = {
    users,
    roles,
    schedules,
    setSchedules,
    addSchedule,
    integrations,
    logs,
    settings,
    documents,
    calendarSettings,
    patientJourney,
    logsManual,
    notifications,
    markNotificationsAsRead,
    markAllAsRead,
    addUser,
    updateUser,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
    updateSettings,
    updateDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    updateCalendarSettings,
    addLog,
    updatePatientJourney,
    updateIntegration,
    updateProtocols,
  };

  if (!calendarSettings || !settings || !documents || !patientJourney || !logsManual) {
    return null; // ou um loader
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};