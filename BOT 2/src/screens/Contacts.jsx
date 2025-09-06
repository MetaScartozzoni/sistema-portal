import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, Phone, Mail, Search, BadgeCheck, UserCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contacts = () => {
  const { contacts, addContact, loading } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [newContact, setNewContact] = useState({
    full_name: '',
    phone: '',
    email: '',
    status: 'lead'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContact = async () => {
    if (!newContact.full_name || !newContact.phone) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome e telefone são obrigatórios."
      });
      return;
    }
    await addContact(newContact);
    setNewContact({ full_name: '', phone: '', email: '', status: 'lead' });
  };

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(contact =>
      contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [contacts, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Gerenciamento de Contatos</h2>
        <p className="text-muted-foreground">Adicione e gerencie os contatos de leads e pacientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="glass-effect-strong text-white">
            <CardHeader>
              <CardTitle>Adicionar Novo Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Nome Completo" name="full_name" value={newContact.full_name} onChange={handleInputChange} />
              <Input placeholder="Telefone (ex: 5511...)" name="phone" value={newContact.phone} onChange={handleInputChange} />
              <Input placeholder="E-mail" name="email" type="email" value={newContact.email} onChange={handleInputChange} />
              <Button onClick={handleAddContact} className="w-full" variant="glassPrimary">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Contato
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="glass-effect-strong text-white">
            <CardHeader>
              <CardTitle>Lista de Contatos</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar contato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                {loading ? <p>Carregando...</p> : filteredContacts.length > 0 ? filteredContacts.map(contact => (
                  <li key={contact.id} className="p-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
                           {contact.status === 'patient' ? <BadgeCheck className="h-5 w-5 text-white" /> : <UserCircle className="h-5 w-5 text-white" />}
                        </div>
                        <div>
                            <span className="font-medium">{contact.full_name}</span>
                            <div className={`text-xs px-2 py-0.5 rounded-full inline-block ml-2 ${contact.status === 'patient' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                {contact.status === 'patient' ? 'Paciente' : 'Lead'}
                            </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/conversation/${contact.id}`)}>
                        Ver Histórico
                      </Button>
                    </div>
                    <div className="mt-2 pl-12 space-y-1 text-sm text-gray-300">
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-300" /><span>{contact.phone}</span></div>
                      {contact.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-300" /><span>{contact.email}</span></div>}
                       {contact.current_journey_step && <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-300" /><span>{contact.current_journey_step}</span></div>}
                    </div>
                  </li>
                )) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Nenhum contato encontrado.</p>
                  </div>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Contacts;
