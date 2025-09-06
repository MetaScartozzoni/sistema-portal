export const getMockRoles = () => [
  { id: '1', name: 'admin', displayName: 'Admin', description: 'Acesso total ao sistema.', color: '#ef4444', permissions: ['users.create', 'users.read', 'users.update', 'users.delete', 'roles.manage', 'settings.manage', 'integrations.manage', 'schedule.create', 'schedule.read', 'schedule.update', 'patients.create', 'patients.read', 'patients.update', 'api.read', 'notifications.send'] },
  { id: '2', name: 'medico', displayName: 'Médico', description: 'Acesso a agendamentos e prontuários.', color: '#3b82f6', permissions: ['schedule.read', 'schedule.update', 'patients.read', 'patients.update'] },
  { id: '3', name: 'secretaria', displayName: 'Secretária', description: 'Gerencia agendamentos e pacientes.', color: '#10b981', permissions: ['users.create', 'users.read', 'schedule.create', 'schedule.read', 'schedule.update', 'patients.create', 'patients.read', 'patients.update', 'notifications.send'] },
  { id: '4', name: 'paciente', displayName: 'Paciente', description: 'Acesso ao portal do paciente.', color: '#8b5cf6', permissions: ['schedule.read'] },
  { id: '5', name: 'fornecedor', displayName: 'Fornecedor', description: 'Contato comercial.', color: '#f97316', permissions: [] },
  { id: '6', name: 'consultor', displayName: 'Consultor', description: 'Acesso limitado para consultoria.', color: '#eab308', permissions: ['users.read', 'schedule.read'] },
  { id: '7', name: 'contact', displayName: 'Contato', description: 'Usuário com cadastro básico, ainda não é paciente.', color: '#78716c', permissions: [] },
];