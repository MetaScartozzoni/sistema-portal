import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Shield, Edit, Trash2, Users, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const Permissions = () => {
  const { roles, users } = useData();
  const { toast } = useToast();

  const getUserCountByRole = (roleName) => {
    return users.filter(user => user.role === roleName).length;
  };

  const handleAction = (action, role) => {
    toast({
      title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
      description: `Ação: ${action} para ${role.displayName}`,
    });
  };

  const getPermissionDescription = (permission) => {
    const descriptions = {
      'users.create': 'Criar usuários',
      'users.read': 'Visualizar usuários',
      'users.update': 'Editar usuários',
      'users.delete': 'Excluir usuários',
      'roles.manage': 'Gerenciar funções',
      'settings.manage': 'Gerenciar configurações',
      'integrations.manage': 'Gerenciar integrações',
      'schedule.create': 'Criar agendamentos',
      'schedule.read': 'Visualizar agendamentos',
      'schedule.update': 'Editar agendamentos',
      'patients.create': 'Criar pacientes',
      'patients.read': 'Visualizar pacientes',
      'patients.update': 'Editar pacientes',
      'api.read': 'Acesso à API',
      'notifications.send': 'Enviar notificações'
    };
    return descriptions[permission] || permission;
  };

  const allPermissions = Array.from(new Set(roles.flatMap(role => role.permissions || [])));

  return (
    <>
      <Helmet>
        <title>Permissões - Portal Admin Clínica</title>
        <meta name="description" content="Gerencie funções e permissões do sistema da clínica, controlando o acesso de usuários a diferentes recursos." />
        <meta property="og:title" content="Permissões - Portal Admin Clínica" />
        <meta property="og:description" content="Gerencie funções e permissões do sistema da clínica, controlando o acesso de usuários a diferentes recursos." />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Permissões</h1>
            <p className="text-gray-400">Gerencie funções e controle de acesso</p>
          </div>
          <Button 
            onClick={() => handleAction('criar', { displayName: 'nova função' })}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Função
          </Button>
        </motion.div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-white/10 card-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${role.color}20`, border: `1px solid ${role.color}40` }}
                      >
                        <Shield className="w-6 h-6" style={{ color: role.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{role.displayName}</CardTitle>
                        <p className="text-gray-400 text-sm">{role.description}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem onClick={() => handleAction('editar', role)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction('excluir', role)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">Usuários com esta função</span>
                      </div>
                      <span className="text-white font-semibold">{getUserCountByRole(role.name)}</span>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Permissões:</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                        {(role.permissions && role.permissions.length > 0) ? (
                          role.permissions.map((permission, permIndex) => (
                            <div 
                              key={permIndex}
                              className="flex items-center justify-between p-2 rounded bg-white/5"
                            >
                              <span className="text-gray-300 text-sm">{getPermissionDescription(permission)}</span>
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm italic">Nenhuma permissão atribuída.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Permission Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Matriz de Permissões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-400 font-medium py-3 px-4">Permissão</th>
                      {roles.map(role => (
                        <th key={role.id} className="text-center text-gray-400 font-medium py-3 px-4">
                          {role.displayName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allPermissions.map(permission => (
                      <tr key={permission} className="border-b border-white/5">
                        <td className="text-white py-3 px-4">{getPermissionDescription(permission)}</td>
                        {roles.map(role => (
                          <td key={role.id} className="text-center py-3 px-4">
                            {(role.permissions && role.permissions.includes(permission)) ? (
                              <div className="w-3 h-3 bg-green-400 rounded-full mx-auto"></div>
                            ) : (
                              <div className="w-3 h-3 bg-gray-600 rounded-full mx-auto"></div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Permissions;