import { useCallback, useMemo, useState } from 'react';
import { addDays, formatISO } from 'date-fns';
import { appointmentTypes } from '@/lib/schedulingConfig';

export function useClinicData(user, profile) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    // Seed with minimal demo data
    const demoPatients = [
      { id: 'p1', name: 'Ana Souza', email: 'ana@example.com', phone: '(11) 99999-0001', journey_status: 'NOVO_CONTATO', budget_status: 'Não Realizado' },
      { id: 'p2', name: 'Bruno Lima', email: 'bruno@example.com', phone: '(11) 99999-0002', journey_status: 'CONSULTA_REALIZADA', budget_status: 'Aguardando Resposta' },
    ];
    const demoDoctors = [
      { id: 'd1', full_name: 'Dr. João' },
      { id: 'd2', full_name: 'Dra. Maria' },
    ];
    const now = new Date();
    const demoAppointments = [
      {
        id: 'a1',
        patient_id: 'p2',
        doctor_id: 'd1',
        start_time: formatISO(addDays(now, 1)),
        end_time: formatISO(addDays(now, 1)),
        status: 'confirmado',
        consultation_type: appointmentTypes.PRIMEIRA_CONSULTA.label,
      },
    ];
    setPatients(demoPatients);
    setDoctors(demoDoctors);
    setAppointments(demoAppointments);
    setAuditLogs([]);
    setLoading(false);
  }, []);

  const handleNewAppointment = useCallback((data, done) => {
    setAppointments((prev) => [
      { id: crypto.randomUUID(), status: 'pendente', ...data },
      ...prev,
    ]);
    if (done) done();
  }, []);

  const handleNewSurgery = useCallback((data, openNext) => {
    const surgeryAppt = { id: crypto.randomUUID(), status: 'pendente', consultation_type: `${appointmentTypes.CIRURGIA.label}: ${data.surgery_type || ''}`.trim(), ...data };
    setAppointments((prev) => [surgeryAppt, ...prev]);
    if (openNext) openNext({ patient_id: data.patient_id, surgeryAppointment: surgeryAppt });
  }, []);

  const handleNewPatient = useCallback((data, done) => {
    setPatients((prev) => [{ id: crypto.randomUUID(), ...data }, ...prev]);
    if (done) done();
  }, []);

  const handleNewContact = useCallback((data, done) => {
    // no-op placeholder
    if (done) done();
  }, []);

  const handleUpdatePatient = useCallback((data) => {
    setPatients((prev) => prev.map((p) => (p.id === data.id ? { ...p, ...data } : p)));
  }, []);

  const handlePauseJourney = useCallback((patient) => {
    setPatients((prev) => prev.map((p) => (p.id === patient.id ? { ...p, journey_status: 'JORNADA_PAUSADA' } : p)));
  }, []);

  const handleResumeJourney = useCallback((patient) => {
    setPatients((prev) => prev.map((p) => (p.id === patient.id ? { ...p, journey_status: 'EM_ACOMPANHAMENTO' } : p)));
  }, []);

  const handleRequestExam = useCallback((data, done) => {
    if (done) done();
  }, []);

  const handleSendDocument = useCallback((data, done) => {
    if (done) done();
  }, []);

  return useMemo(
    () => ({
      appointments,
      patients,
      doctors,
      auditLogs,
      loading,
      fetchData,
      handleNewAppointment,
      handleNewSurgery,
      handleNewPatient,
      handleNewContact,
      handleUpdatePatient,
      handlePauseJourney,
      handleResumeJourney,
      handleRequestExam,
      handleSendDocument,
    }),
    [appointments, patients, doctors, auditLogs, loading, fetchData, handleNewAppointment, handleNewSurgery, handleNewPatient, handleNewContact, handleUpdatePatient, handlePauseJourney, handleResumeJourney, handleRequestExam, handleSendDocument]
  );
}

