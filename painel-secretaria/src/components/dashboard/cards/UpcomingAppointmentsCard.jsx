import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';
import PatientNotesDialog from '@/components/dashboard/dialogs/PatientNotesDialog';

const UpcomingAppointmentsCard = ({ appointments, patients }) => {
  const [selectedPatientForNotes, setSelectedPatientForNotes] = useState(null);

  const handlePatientClick = (patient) => {
    setSelectedPatientForNotes(patient);
  };

  const handleCloseNotesDialog = () => {
    setSelectedPatientForNotes(null);
  };

  return (
    <>
      <Card className="bg-white/10 border-white/20 text-white h-full">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="w-5 h-5 mr-3 text-purple-400" />
            Próximos Atendimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patient_id);
                  if (!patient) return null;

                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center p-3 rounded-lg bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.name}`} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="font-semibold text-sm text-white truncate">{patient.name}</p>
                        <p className="text-xs text-gray-400 truncate">{appointment.consultation_type}</p>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <div className="flex items-center justify-end text-xs text-gray-300">
                          <Clock className="w-3 h-3 mr-1.5" />
                          <span>{format(parseISO(appointment.start_time), 'HH:mm')}</span>
                        </div>
                        <p className="text-xs text-gray-400 capitalize">
                          {format(parseISO(appointment.start_time), 'dd MMM', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p>Nenhum atendimento agendado para hoje.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
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

export default UpcomingAppointmentsCard;