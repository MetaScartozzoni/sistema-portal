export const getMockLogs = () => [
  { id: 'log1', action: 'user.login', user: 'Dr. Carlos Ferreira', description: 'Login bem-sucedido.', level: 'info', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'log2', action: 'schedule.create', user: 'Mariana Lima', description: 'Novo agendamento criado para João Pedro.', level: 'info', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'log3', action: 'api.error', user: 'Sistema', description: 'Falha ao conectar com a API do Portal do Paciente (código 503).', level: 'error', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), errorCode: 'API_503' },
  { id: 'log4', action: 'user.permission.update', user: 'Admin', description: 'Permissões do usuário Lucas Martins atualizadas.', level: 'warning', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), errorCode: 'PERM_001' },
];