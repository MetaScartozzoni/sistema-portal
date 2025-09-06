export const getMockSettings = () => ({
  general: {
    clinicName: 'Clínica Horizonte',
    cnpj: '12.345.678/0001-90',
    address: 'Rua Exemplo, 123, Cidade, Estado',
    phone: '(XX) XXXX-XXXX',
    email: 'contato@clinica.com',
    technicalManagerMedical: 'Dr. Carlos Ferreira',
    technicalManagerNursing: 'Enf. Chefe Ana Souza',
    technicalManagerAdmin: 'Mariana Lima',
  },
  system: {
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    dateFormat: 'DD/MM/YYYY',
    apiStatus: [
      { id: 'portal_medico', name: 'Portal do Médico', status: 'ok' },
      { id: 'portal_secretaria', name: 'Portal da Secretária', status: 'ok' },
      { id: 'portal_paciente', name: 'Portal do Paciente', status: 'error' },
      { id: 'portal_orcamento', name: 'Portal de Orçamento', status: 'ok' },
      { id: 'chatbot', name: 'ChatBot', status: 'ok' },
    ]
  },
  notifications: {
    email: true,
    sms: false,
    whatsapp: true,
    protocols: [
        {
          id: 'proto_1',
          name: 'Alerta de Paciente Idoso para Cardiologia',
          trigger: 'patient.created',
          conditions: [
            { field: 'age', operator: '>', value: '60' },
          ],
          action: { type: 'notification', target: 'tech_manager_medical' },
          enabled: true,
        },
        {
          id: 'proto_2',
          name: 'Notificar Dermatologista sobre nova consulta',
          trigger: 'appointment.scheduled',
          conditions: [
             { field: 'specialty', operator: '=', value: 'Dermatologia' },
          ],
          action: { type: 'notification', target: '2' }, // ID da Dra. Ana Rodrigues
          enabled: false,
        }
    ]
  }
});