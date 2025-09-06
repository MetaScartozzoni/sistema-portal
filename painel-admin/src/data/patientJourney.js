export const getMockPatientJourney = () => ({
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Triagem',
      patientIds: ['9'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Em Tratamento',
      patientIds: ['4'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Aguardando Exames',
      patientIds: ['5'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Alta',
      patientIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
});