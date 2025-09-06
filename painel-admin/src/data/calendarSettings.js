export const getMockCalendarSettings = () => ({
  appointmentTypes: [
    { id: '1', name: 'Consulta', duration: 60, color: '#3b82f6' },
    { id: '2', name: 'Retorno', duration: 30, color: '#10b981' },
    { id: '3', name: 'Emergência', duration: 90, color: '#ef4444' },
    { id: '4', name: 'Reunião', duration: 45, color: '#eab308' },
    { id: '5', name: 'Pessoal', duration: 60, color: '#8b5cf6' },
  ],
  workingHours: [
    {
      professionalId: '1',
      professionalName: 'Dr. Carlos Ferreira',
      days: [
        { day: 'Segunda', active: true, start: '08:00', end: '18:00' },
        { day: 'Terça', active: true, start: '08:00', end: '18:00' },
        { day: 'Quarta', active: true, start: '08:00', end: '12:00' },
        { day: 'Quinta', active: true, start: '08:00', end: '18:00' },
        { day: 'Sexta', active: false, start: '09:00', end: '17:00' },
        { day: 'Sábado', active: false, start: '09:00', end: '13:00' },
        { day: 'Domingo', active: false, start: '09:00', end: '17:00' },
      ]
    },
    {
      professionalId: '2',
      professionalName: 'Dra. Ana Rodrigues',
      days: [
        { day: 'Segunda', active: true, start: '09:00', end: '19:00' },
        { day: 'Terça', active: false, start: '09:00', end: '19:00' },
        { day: 'Quarta', active: true, start: '09:00', end: '19:00' },
        { day: 'Quinta', active: true, start: '09:00', end: '19:00' },
        { day: 'Sexta', active: true, start: '09:00', end: '17:00' },
        { day: 'Sábado', active: false, start: '09:00', end: '13:00' },
        { day: 'Domingo', active: false, start: '09:00', end: '17:00' },
      ]
    }
  ],
  general: {
    clinicWorkingHours: [
      { day: 'Domingo', dayIndex: 0, active: false, start: '09:00', end: '17:00' },
      { day: 'Segunda', dayIndex: 1, active: true, start: '08:00', end: '19:00' },
      { day: 'Terça', dayIndex: 2, active: true, start: '08:00', end: '19:00' },
      { day: 'Quarta', dayIndex: 3, active: true, start: '08:00', end: '19:00' },
      { day: 'Quinta', dayIndex: 4, active: true, start: '08:00', end: '19:00' },
      { day: 'Sexta', dayIndex: 5, active: true, start: '08:00', end: '17:00' },
      { day: 'Sábado', dayIndex: 6, active: false, start: '09:00', end: '13:00' },
    ],
    blockouts: [
      { id: 'b1', title: 'Feriado Nacional', startDate: '2025-09-07', endDate: '2025-09-07', recurring: 'yearly' }
    ]
  }
});