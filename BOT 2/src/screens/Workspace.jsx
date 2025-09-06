import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import ConversationCard from '@/components/ConversationCard';
import { AlertTriangle } from 'lucide-react';

const Workspace = () => {
  const { messages, contacts, loading } = useData();
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    tag: 'all',
  });
  
  const enrichedMessages = useMemo(() => {
    if (loading || !messages || !contacts) return [];
    
    return messages
      .map(msg => {
        const contact = contacts.find(c => c.id === msg.contact_id);
        if (!contact) return null;
        
        const contactTags = Array.isArray(contact.contact_tags) 
          ? contact.contact_tags.map(ct => ct.tags?.id).filter(Boolean) 
          : [];

        return {
          ...msg,
          patientName: contact.full_name,
          patientId: contact.phone,
          tags: contactTags,
          isNewPatient: contact.created_at ? new Date(contact.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000) : false
        };
      })
      .filter(Boolean);
  }, [messages, contacts, loading]);


  const filteredMessages = useMemo(() => {
    return enrichedMessages.filter(message => {
      const matchesSearch = filters.search === '' || 
        message.patientName.toLowerCase().includes(filters.search.toLowerCase()) || 
        message.patientId.includes(filters.search);
      const matchesPriority = filters.priority === 'all' || message.priority === filters.priority;
      const matchesTag = filters.tag === 'all' || (message.tags && message.tags.includes(filters.tag));

      return matchesSearch && matchesPriority && matchesTag && message.status !== 'resolvido';
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [enrichedMessages, filters]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
        <div className="text-center py-16 text-muted-foreground">
            <p>Carregando conversas...</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <WorkspaceHeader filters={filters} setFilters={setFilters} />
      
      {filteredMessages.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredMessages.map((message) => (
            <motion.div key={message.id} variants={itemVariants}>
              <ConversationCard message={message} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-lg border border-border">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">Nenhuma conversa encontrada</h3>
          <p className="mt-2 text-sm">Tente ajustar seus filtros ou aguarde novas mensagens.</p>
        </div>
      )}
    </div>
  );
};

export default Workspace;