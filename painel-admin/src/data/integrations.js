export const getMockIntegrations = () => [
  {
    id: 'portal_medico',
    name: 'Portal do Médico',
    description: 'Acesso para médicos aos prontuários e agenda.',
    status: 'active',
    apiKey: 'med_live_sk_xxxxxxxxxxxx1234',
    version: 'v1.2.0',
    icon: 'Stethoscope',
    features: [
      { id: 'email', name: 'Notificações por Email', description: 'Envia emails para novas consultas.', enabled: true },
      { id: 'sms', name: 'Lembretes por SMS', description: 'Envia SMS 24h antes da consulta.', enabled: false }
    ],
    documentation: {
      author: 'Equipe de Dev Interna',
      version: 'v1.2.0',
      description: 'API para gerenciar dados de médicos, incluindo acesso a prontuários e agenda pessoal.',
      endpoints: [
        { method: 'GET', path: '/api/v1/medico/agenda', description: 'Retorna a agenda do médico autenticado.' },
        { method: 'GET', path: '/api/v1/medico/pacientes/{id}', description: 'Retorna os detalhes de um paciente específico.' },
      ]
    }
  },
  {
    id: 'portal_secretaria',
    name: 'Portal da Secretária',
    description: 'Acesso para secretárias gerenciarem agendamentos.',
    status: 'active',
    apiKey: 'sec_live_sk_xxxxxxxxxxxx5678',
    version: 'v1.1.0',
    icon: 'ClipboardUser',
    features: [
      { id: 'email', name: 'Notificações por Email', description: 'Envia emails de confirmação de agendamento.', enabled: true },
      { id: 'third-party', name: 'Integração Google Agenda', description: 'Sincroniza com a agenda do Google.', enabled: true }
    ],
    documentation: {
      author: 'Equipe de Dev Interna',
      version: 'v1.1.0',
      description: 'API para gerenciamento geral de agendamentos e pacientes.',
      endpoints: [
        { method: 'GET', path: '/api/v1/agenda/geral', description: 'Retorna a agenda completa da clínica.' },
        { method: 'POST', path: '/api/v1/agenda/agendar', description: 'Cria um novo agendamento.' },
        { method: 'PUT', path: '/api/v1/pacientes/{id}', description: 'Atualiza os dados de um paciente.' },
      ]
    }
  },
  {
    id: 'portal_paciente',
    name: 'Portal do Paciente',
    description: 'Acesso para pacientes visualizarem seus dados.',
    status: 'inactive',
    apiKey: 'pac_live_sk_xxxxxxxxxxxx9012',
    version: 'v2.0.1',
    icon: 'User',
    features: [
      { id: 'email', name: 'Notificações por Email', description: 'Envia emails sobre novos documentos ou resultados.', enabled: true },
      { id: 'sms', name: 'Lembretes por SMS', description: 'Envia lembretes de consultas via SMS.', enabled: true }
    ],
    documentation: {
      author: 'Fornecedor Externo Co.',
      version: 'v2.0.1',
      description: 'API para o paciente acessar seus próprios dados, agendamentos e documentos.',
      endpoints: [
        { method: 'GET', path: '/api/v2/paciente/meus-dados', description: 'Retorna os dados do paciente autenticado.' },
        { method: 'GET', path: '/api/v2/paciente/agenda', description: 'Retorna os próximos agendamentos do paciente.' },
      ]
    }
  },
  {
    id: 'portal_orcamento',
    name: 'Portal de Orçamento',
    description: 'Integração com o sistema de orçamentos.',
    status: 'active',
    apiKey: 'orc_live_sk_xxxxxxxxxxxx3456',
    version: 'v1.0.0',
    icon: 'FileBarChart2',
    features: [],
    documentation: {
      author: 'Financeiro Dev',
      version: 'v1.0.0',
      description: 'API para conectar a jornada do paciente com o sistema de orçamentos.',
      endpoints: [
        { method: 'POST', path: '/api/v1/orcamento/criar', description: 'Cria um novo orçamento para um paciente.' },
      ]
    }
  },
  {
    id: 'chatbot',
    name: 'ChatBot',
    description: 'Integração com o bot de atendimento via WhatsApp.',
    status: 'active',
    apiKey: 'bot_live_sk_xxxxxxxxxxxx7890',
    version: 'v3.5.2',
    icon: 'Bot',
    features: [
      { id: 'third-party', name: 'Integração WhatsApp', description: 'Conecta com a API oficial do WhatsApp.', enabled: true },
    ],
    documentation: {
      author: 'BotMasters Inc.',
      version: 'v3.5.2',
      description: 'API para automação de conversas e agendamentos via WhatsApp.',
      endpoints: [
        { method: 'POST', path: '/webhook/whatsapp', description: 'Recebe mensagens do WhatsApp.' },
        { method: 'POST', path: '/api/v3/bot/enviar-msg', description: 'Envia uma mensagem para um número.' },
      ]
    }
  }
];