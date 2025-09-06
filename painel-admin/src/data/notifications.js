export const getMockNotifications = () => [
  {
    id: 'notif_1',
    title: 'Integração Atualizada',
    description: 'O Portal do Médico foi atualizado para a v1.2.0.',
    type: 'info',
    timestamp: '2025-08-25T14:30:00Z',
    read: false,
    link: '/integrations'
  },
  {
    id: 'notif_2',
    title: 'Novo Agendamento de Cirurgia',
    description: 'Cirurgia agendada para o paciente Carlos Andrade.',
    type: 'success',
    timestamp: '2025-08-25T11:15:00Z',
    read: true,
    link: '/schedule'
  },
  {
    id: 'notif_3',
    title: 'Falha na API',
    description: 'A integração com o Portal do Paciente está apresentando falhas.',
    type: 'error',
    timestamp: '2025-08-24T09:00:00Z',
    read: false,
    link: '/settings'
  },
    {
    id: 'notif_4',
    title: 'Novo Documento Adicionado',
    description: 'Um novo termo de consentimento foi adicionado.',
    type: 'info',
    timestamp: '2025-08-23T18:00:00Z',
    read: true,
    link: '/documents'
  },
    {
    id: 'notif_5',
    title: 'Permissões Alteradas',
    description: 'A função "Secretária" teve suas permissões atualizadas.',
    type: 'warning',
    timestamp: '2025-08-22T12:00:00Z',
    read: true,
    link: '/permissions'
  },
];