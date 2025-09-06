export const mapAppointmentToEvent = (appt) => ({
  id: appt.id,
  date: new Date(appt.appointment_time || appt.surgery_start_at),
  title: appt.patient?.full_name || appt.title || 'Evento',
  type: (appt.visit_type || 'pessoal').toLowerCase(),
  whereby_link: appt.whereby_link,
  notes: appt.notes,
});
export const mergeAgendaLists = (appointments = [], surgeries = []) => [
  ...appointments.map(mapAppointmentToEvent),
  ...surgeries.map(mapAppointmentToEvent),
];
