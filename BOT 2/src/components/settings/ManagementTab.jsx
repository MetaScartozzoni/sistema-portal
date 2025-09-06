import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { UserPlus, Trash2, User, Briefcase } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ManagementTab = () => {
  const { toast } = useToast();
  const { users, addUser, removeUser } = useData();
  const [newUserName, setNewUserName] = useState('');
  const [newUserSector, setNewUserSector] = useState('');

  const handleAddUser = () => {
    if (!newUserName || !newUserSector) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha o nome e o setor do atendente."
      });
      return;
    }
    const newUser = {
      id: Date.now(),
      name: newUserName,
      sector: newUserSector
    };
    addUser(newUser);
    setNewUserName('');
    setNewUserSector('');
    toast({
      title: "🎉 Atendente adicionado!",
      description: `${newUserName} foi adicionado ao setor de ${newUserSector}.`
    });
  };

  const handleRemoveUser = (userId) => {
    removeUser(userId);
    toast({
      title: "🗑️ Atendente removido!",
      description: "O atendente foi removido com sucesso."
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Gerenciamento de Atendentes</h2>
        <p className="text-muted-foreground">Adicione, remova e gerencie os acessos dos atendentes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect-strong text-foreground">
          <CardHeader>
            <CardTitle className="text-foreground">Adicionar Novo Atendente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Nome do Atendente" 
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="bg-input text-foreground border-border placeholder:text-muted-foreground"
              />
              <Select onValueChange={setNewUserSector} value={newUserSector}>
                <SelectTrigger className="w-[180px] bg-input text-foreground border-border">
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendamento">Agendamento</SelectItem>
                  <SelectItem value="duvidas">Dúvidas</SelectItem>
                  <SelectItem value="orcamento">Orçamento</SelectItem>
                  <SelectItem value="todos">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddUser} className="w-full" variant="glassPrimary">
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Atendente
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect-strong text-foreground">
          <CardHeader>
            <CardTitle className="text-foreground">Atendentes Atuais</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
              {users.map(user => (
                <li key={user.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-300" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span className="capitalize">{user.sector}</span>
                    </div>
                    <Button variant="destructive" size="icon" className="h-8 w-8 bg-red-500/50 hover:bg-red-500/70" onClick={() => handleRemoveUser(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagementTab;