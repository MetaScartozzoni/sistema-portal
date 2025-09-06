export const getMockSchedules = () => [
  { id: '1', participantIds: ['4'], patientName: 'João Pedro', professionalId: '1', doctorName: 'Dr. Carlos Ferreira', date: '2025-08-26', time: '10:00', status: 'confirmed', type: 'Consulta', reason: 'Check-up Anual' },
  { id: '2', participantIds: ['5'], patientName: 'Fernanda Costa', professionalId: '2', doctorName: 'Dra. Ana Rodrigues', date: '2025-08-27', time: '14:30', status: 'confirmed', type: 'Consulta', reason: 'Consulta de Rotina' },
  { id: '3', participantIds: ['1', '2', '3'], patientName: 'Dr. Carlos, Dra. Ana, Mariana', professionalId: '1', doctorName: 'Dr. Carlos Ferreira', date: '2025-08-28', time: '09:00', status: 'confirmed', type: 'Reunião', reason: 'Reunião de equipe' }
];