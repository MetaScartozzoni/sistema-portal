import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal, Star, StarHalf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AddUserModal from '@/components/AddUserModal';
import EditUserModal from '@/components/EditUserModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StarRating = ({ rating, onRate, userId }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400 fill-yellow-400 cursor-pointer"
          onClick={() => onRate(userId, i)}
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <StarHalf
          key={`half-${i}`}
          className="w-4 h-4 text-yellow-400 fill-yellow-400 cursor-pointer"
          onClick={() => onRate(userId, i)}
        />
      );
    } else {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-500 cursor-pointer"
          onClick={() => onRate(userId, i - 0.5)}
        />
      );
    }
  }
  return <div className="flex">{stars}</div>;
};

const Users = () => {
  const { users, roles, updateUser } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleInfo = (roleName) => {
    return roles.find(role => role.name === roleName) || { displayName: roleName, color: '#6b7280' };
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-400' : 'text-red-400';
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  const handleRateUser = (userId, newRating) => {
    const userToUpdate = users.find(u => u.id === userId);
    const currentRating = userToUpdate.rating || 0;
    
    let finalRating = newRating;
    if (Math.floor(currentRating) === newRating) {
      finalRating = newRating - 0.5;
    } else if (currentRating === newRating - 0.5) {
      finalRating = newRating;
    }

    updateUser(userId, { rating: finalRating });
    toast({
        title: "Avaliação Atualizada!",
        description: `A avaliação de ${userToUpdate.name} foi atualizada para ${finalRating}.`,
    });
  };

  const handleAction = (action, user) => {
    toast({
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Usuários - Portal Admin Clínica</title>
        <meta name="description" content="Gerencie usuários do sistema da clínica, incluindo médicos, secretárias e administradores com controle de permissões." />
      </Helmet>
      
      <TooltipProvider>
        <AddUserModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        <EditUserModal user={selectedUser} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Usuários</h1>
              <p className="text-gray-400">Gerencie usuários e suas permissões</p>
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 mt-4 sm:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <Select onValueChange={setSelectedRole} defaultValue="all">
              <SelectTrigger className="w-full sm:w-auto bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Todas as funções" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-white/10 text-white">
                <SelectItem value="all">Todas as funções</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.name}>{role.displayName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user, index) => {
              const roleInfo = getRoleInfo(user.role);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                >
                  <Card className="glass-effect border-white/10 card-hover flex flex-col h-full">
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-white font-semibold">{user.name}</h3>
                            <p className="text-gray-400 text-sm truncate max-w-[150px]">{user.email}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-effect border-white/10 text-white">
                            <DropdownMenuItem onClick={() => handleAction('visualizar', user)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction('excluir', user)}
                              className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-3 mt-auto">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Função:</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="px-2 py-1 rounded-full text-xs font-medium cursor-default" style={{ backgroundColor: `${roleInfo.color}20`, color: roleInfo.color, border: `1px solid ${roleInfo.color}40` }}>
                                {roleInfo.displayName}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="glass-effect border-white/10 text-white">
                              <p>{roleInfo.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Status:</span>
                          <span className={`text-sm font-medium ${getStatusColor(user.status)}`}>
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        
                        {(user.role === 'medico' || user.role === 'secretaria') && (
                           <div className="flex items-center justify-between">
                             <span className="text-gray-400 text-sm">Avaliação:</span>
                             <StarRating rating={user.rating || 0} onRate={handleRateUser} userId={user.id} />
                           </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Último acesso:</span>
                          <span className="text-white text-sm">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-400">Tente ajustar os filtros de busca</p>
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    </>
  );
};

export default Users;