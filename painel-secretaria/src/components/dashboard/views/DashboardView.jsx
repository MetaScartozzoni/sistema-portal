import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { isToday, parseISO } from 'date-fns';
import DashboardSummaryCard from '@/components/dashboard/cards/DashboardSummaryCard';
import UpcomingAppointmentsCard from '@/components/dashboard/cards/UpcomingAppointmentsCard';
import RecentActivityCard from '@/components/dashboard/cards/RecentActivityCard.jsx';
import { Stethoscope, UserPlus, Scissors, Users, CalendarCheck } from 'lucide-react';
import PatientNotesDialog from '@/components/dashboard/dialogs/PatientNotesDialog';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const DashboardView = ({ appointments, patients, onNewAppointment, onNewPatient, onNewSurgery }) => {
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [selectedPatientForNotes, setSelectedPatientForNotes] = useState(null);

  const todayAppointments = useMemo(() => {
    return (appointments || [])
      .filter(app => isToday(parseISO(app.start_time)))
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }, [appointments]);

  const summaryStats = useMemo(() => {
    const totalAppointments = (appointments || []).length;
    const totalPatients = (patients || []).length;
    const totalSurgeries = (appointments || []).filter(a => a.consultation_type?.toLowerCase().includes('cirurgia')).length;
    return { totalAppointments, totalPatients, totalSurgeries };
  }, [appointments, patients]);

  const handlePatientNoteClick = (patient) => {
    setSelectedPatientForNotes(patient);
  };

  const handleCloseNotesDialog = () => {
    setSelectedPatientForNotes(null);
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <DashboardSummaryCard
                icon={Users}
                title="Total de Pacientes"
                value={summaryStats.totalPatients}
                color="from-blue-500 to-cyan-500"
                tooltipText="Clique para cadastrar um novo paciente"
                onClick={onNewPatient}
                isSelected={selectedFilter === 'patients'}
              />
              <DashboardSummaryCard
                icon={CalendarCheck}
                title="Consultas Agendadas"
                value={summaryStats.totalAppointments}
                color="from-purple-500 to-violet-500"
                tooltipText="Clique para agendar uma nova consulta"
                onClick={onNewAppointment}
                isSelected={selectedFilter === 'appointments'}
              />
              <DashboardSummaryCard
                icon={Scissors}
                title="Cirurgias Agendadas"
                value={summaryStats.totalSurgeries}
                color="from-pink-500 to-rose-500"
                tooltipText="Clique para agendar uma nova cirurgia"
                onClick={onNewSurgery}
                isSelected={selectedFilter === 'surgeries'}
              />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <RecentActivityCard patients={patients} appointments={appointments} />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="lg:col-span-1">
          <UpcomingAppointmentsCard
            appointments={todayAppointments}
            patients={patients}
            onPatientClick={handlePatientNoteClick}
          />
        </motion.div>
      </motion.div>
      
      {selectedPatientForNotes && (
        <PatientNotesDialog
          open={!!selectedPatientForNotes}
          onOpenChange={handleCloseNotesDialog}
          patient={selectedPatientForNotes}
        />
      )}
    </>
  );
};

export default DashboardView;
