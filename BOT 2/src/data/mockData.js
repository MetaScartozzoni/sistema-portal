const mockMessages = [
  {
    id: 1,
    contact_id: "contact_1",
    content: "Gostaria de agendar uma consulta para próxima semana",
    type: "text",
    status: "received",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    from_contact: true,
  },
  {
    id: 2,
    contact_id: "contact_2",
    content: "Qual o valor da consulta de cardiologia?",
    type: "text",
    status: "received",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    from_contact: true,
  },
  {
    id: 3,
    contact_id: "contact_3",
    content: "Preciso esclarecer dúvidas sobre meu exame",
    type: "text",
    status: "read",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    from_contact: true,
  },
  {
    id: 6,
    contact_id: "contact_1",
    content: "Olá Maria, claro! Temos horários disponíveis na terça-feira às 10h ou na quinta-feira às 15h. Qual prefere?",
    type: "text",
    status: "sent",
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    from_contact: false,
  }
];

const mockSystemLogs = [
  {
    id: 1,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    user: { name: "Admin Geral" },
    action: "Login",
    details: "Usuário 'Admin Geral' logou no sistema.",
  },
  {
    id: 2,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    user: { name: "Sistema" },
    action: "Mensagem Recebida",
    details: "Nova mensagem de 'Maria Silva' no setor 'agendamento'.",
  },
  {
    id: 3,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    user: { name: "Admin Geral" },
    action: "Prioridade Alterada",
    details: "Prioridade da conversa com Maria Silva alterada para 'alta'.",
  },
  {
    id: 6,
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    user: { name: "Admin Geral" },
    action: "Usuário Criado",
    details: "Novo usuário 'Atendente Ana' criado.",
  }
];

const mockUsers = [
  {
    id: 'user_admin_01',
    name: 'Admin Geral',
    email: 'admin@marcioplasticsurgery.com',
    password: 'adminpassword',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    status: 'active',
    permissions: ['read:all', 'write:all'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date().toISOString(),
    rating: 4.9,
    journeyStatus: 'Completo'
  },
  {
    id: 'user_agent_01',
    name: 'Atendente Ana',
    email: 'ana@marcioplasticsurgery.com',
    password: 'anapassword',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=ana',
    status: 'active',
    permissions: ['read:own', 'write:own'],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    rating: 4.7,
    journeyStatus: 'Em Andamento'
  }
];

const mockTags = [
    { id: 1, name: "Novo Paciente", color: "bg-blue-500" },
    { id: 2, name: "Pós-operatório", color: "bg-green-500" },
    { id: 3, name: "Urgente", color: "bg-red-500" },
    { id: 4, name: "Aguardando Pagamento", color: "bg-yellow-500" },
];

const mockContacts = [
    {
        id: 'contact_1',
        full_name: "Maria Silva",
        phone: "5511987654321",
        last_message_timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: "active",
        contact_tags: [
            { id: 1, name: "Novo Paciente", color: "bg-blue-500" }
        ],
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'contact_2',
        full_name: "João Santos",
        phone: "5521912345678",
        last_message_timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: "active",
        contact_tags: [],
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'contact_3',
        full_name: "Ana Costa",
        phone: "5531988887777",
        last_message_timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: "archived",
        contact_tags: [
            { id: 2, name: "Pós-operatório", color: "bg-green-500" }
        ],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

const mockSettings = {
    apiKey: 'mock-api-key-12345',
    externalIdParam: 'patient_id',
    notifications: {
        email: true,
        sms: false,
        push: true,
    }
};

export const initialMockData = {
  messages: mockMessages,
  systemLogs: mockSystemLogs,
  users: mockUsers,
  tags: mockTags,
  contacts: mockContacts,
  settings: mockSettings,
};