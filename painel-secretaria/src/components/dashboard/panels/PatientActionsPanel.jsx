
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, User, ArrowRight } from 'lucide-react';
import PatientInfoHeader from './PatientInfoHeader';
import PatientActions from './PatientActions';
import NextActionCard from './NextActionCard';
import { useNextAction } from '@/hooks/useNextAction';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

const PatientActionsPanel = ({
  selectedPatient,
  appointments,
  onClose,
  onCall,
  onNewAppointment,
  onNewSurgery,
  onNewPostOpAppointment,
  onUpdatePatient,
  onPauseJourney,
  onResumeJourney,
  onRequestExam,
  onSendDocument,
  onSendMessage,
  onViewJourney
}) => {
  const panelRef = useRef();
  useOnClickOutside(panelRef, onClose);

  const nextAction = useNextAction({ 
    patient: selectedPatient, 
    appointments, 
    onNewAppointment,
    onNewSurgery,
    onNewPostOpAppointment,
    onClose,
    onPauseJourney
  });
  
  if (!selectedPatient) return null;

  return (
    <motion.div
      ref={panelRef}
      layoutId={`patient-card-${selectedPatient.id}`}
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0.5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t-2 border-purple-500/50 shadow-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
      style={{
        width: 'clamp(300px, 90%, 1200px)',
        margin: '0 auto',
      }}
    >
      <div className="p-4 relative">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        <PatientInfoHeader patient={selectedPatient} appointments={appointments} onCall={onCall} />
        
        <div className="mt-4 p-4 bg-black/20 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-2">Ações Rápidas</h3>
            <PatientActions
              patient={selectedPatient}
              onNewAppointment={() => onNewAppointment({ patient_id: selectedPatient.id })}
              onNewSurgery={() => onNewSurgery({ patient_id: selectedPatient.id })}
              onNewPostOpAppointment={() => onNewPostOpAppointment({ patient_id: selectedPatient.id })}
              onSendDocument={() => onSendDocument({ patientId: selectedPatient.id })}
              onPauseJourney={() => onPauseJourney(selectedPatient)}
              onResumeJourney={() => onResumeJourney(selectedPatient)}
              onRequestExam={() => onRequestExam({ patientId: selectedPatient.id })}
              onSendMessage={() => onSendMessage({ patientId: selectedPatient.id })}
            />
          </div>
          <div className="md:col-span-1 space-y-4">
            <NextActionCard nextAction={nextAction} patientName={selectedPatient.name} />
            <Button variant="outline" className="w-full flex-col h-20 border-teal-500/50 text-teal-300 hover:bg-teal-500/10" onClick={() => onViewJourney(selectedPatient)}>
              <div className="flex items-center">
                <User className="w-6 h-6 mr-2" />
                <span className="text-lg font-semibold">Ver Jornada do Paciente</span>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientActionsPanel;