import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { initialMockData } from '@/data/mockData';

const DataContext = createContext(null);

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const { toast } = useToast();

  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(initialMockData.settings);

  const fetchData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setMessages(initialMockData.messages || []);
      setContacts(initialMockData.contacts || []);
      setTags(initialMockData.tags || []);
      setUsers(initialMockData.users || []);
      setSystemLogs(initialMockData.systemLogs || []);
      setSettings(initialMockData.settings || { apiKey: '', externalIdParam: '' });
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addLogEntry = useCallback((action, details) => {
    const newLog = {
      id: `log${Date.now()}`,
      created_at: new Date().toISOString(),
      action,
      details,
      user: { name: 'Usuário Mock' }
    };
    setSystemLogs(prev => [newLog, ...prev]);
  }, []);
  
  const addContact = async (contactData) => {
    const newContact = {
        ...contactData,
        id: `contact${Date.now()}`,
        contact_tags: [],
        created_at: new Date().toISOString()
    };
    setContacts(prev => [...prev, newContact]);
    addLogEntry('Contato Adicionado', { contact_name: newContact.full_name });
    toast({ title: "Sucesso!", description: "Novo contato adicionado (localmente)." });
  };

  const addMessage = (messageData) => {
    const newMessage = {
        ...messageData,
        id: `msg${Date.now()}`,
        created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const addTag = (tagData) => {
    const newTag = { ...tagData, id: `tag${Date.now()}` };
    setTags(prev => [...prev, newTag]);
    addLogEntry('Etiqueta Adicionada', { tag_name: newTag.name });
  };

  const removeTag = (tagId) => {
    setTags(prev => prev.filter(t => t.id !== tagId));
  };
  
  const updateUser = (userId, updatedData) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    addLogEntry('Usuário Atualizado', { user_id: userId, changes: Object.keys(updatedData).join(', ') });
    toast({ title: "Sucesso!", description: `Usuário ${userId} atualizado (localmente).` });
  };


  const updateSettings = (newSettings) => {
    setSettings(prev => ({...prev, ...newSettings}));
  };

  const value = {
    messages,
    contacts,
    tags,
    users,
    systemLogs,
    settings,
    loading,
    addLogEntry,
    addContact,
    addMessage,
    addTag,
    removeTag,
    updateUser,
    updateSettings
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};