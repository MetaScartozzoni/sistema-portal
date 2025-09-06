
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity, UserPlus, CalendarPlus, Mail, CheckCircle, XCircle, Scissors, HeartPulse, Contact } from 'lucide-react';
import { motion } from 'framer-motion';

const activityConfig = {
  new_contact: { icon: Contact, color: 'text-teal-400', bgColor: 'bg-teal-500/10' },
  new_patient: { icon: UserPlus, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  new_appointment: { icon: CalendarPlus, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  budget_sent: { icon: Mail, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  budget_accepted: { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  budget_rejected: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  surgery_scheduled: { icon: Scissors, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  post_op_return_scheduled: { icon: HeartPulse, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  default: { icon: Activity, color: 'text-gray-400', bgColor: 'bg-gray-500/10' },
};

const ActivityItem = ({ activity, index }) => {
  const { icon: Icon, color, bgColor } = activityConfig[activity.type] || activityConfig.default;
  const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ptBR });
  const patientData = activity.data.name ? activity.data : activity.patient;

  if (!patientData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start space-x-4 hover:bg-white/5 p-2 rounded-lg"
    >
      <div className={`relative ${index > 0 ? 'mt-4' : ''}`}>
        <div className={`absolute left-1/2 -top-4 -translate-x-1/2 h-4 w-px bg-white/10 ${index === 0 ? 'hidden' : ''}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 h-4 w-px bg-white/10"></div>
      </div>
      <div className="flex-grow pt-2">
        <p className="text-sm text-white">{activity.description}</p>
        <p className="text-xs text-gray-400">{timeAgo}</p>
      </div>
    </motion.div>
  );
};

const RecentActivityCard = ({ patients, appointments }) => {
  const combinedActivities = [
    ...(patients || []).map(p => {
      const isJustContact = !p.dob;
      return { 
        type: isJustContact ? 'new_contact' : 'new_patient', 
        data: p, 
        timestamp: p.created_at,
        description: isJustContact ? `Novo contato recebido: ${p.name}` : `Novo paciente cadastrado: ${p.name}`
      }
    }),
    ...(appointments || []).map(a => {
      const patient = patients.find(p => p.id === a.patient_id);
      let description = `Novo agendamento para: ${patient?.name || 'Paciente Desconhecido'}`;
      let type = 'new_appointment';

      if (a.consultation_type && a.consultation_type.includes('Cirurgia')) {
        type = 'surgery_scheduled';
        description = `Cirurgia agendada para: ${patient?.name || 'Paciente Desconhecido'}`;
      } else if (a.consultation_type && a.consultation_type.includes('Retorno Pós Operatório')) {
        type = 'post_op_return_scheduled';
        description = `Retorno Pós-Operatório agendado para: ${patient?.name || 'Paciente Desconhecido'}`;
      }

      return { type, data: a, timestamp: a.start_time, patient, description };
    }),
    ...(patients || [])
      .filter(p => p.budget_status)
      .flatMap(p => {
        const activities = [];
        if (p.budget_sent_date) {
          activities.push({ type: 'budget_sent', data: p, timestamp: p.budget_sent_date, description: `Orçamento enviado para: ${p.name}` });
        }
        if (p.budget_status === 'Aceito' && p.budget_accepted_date) {
          activities.push({ type: 'budget_accepted', data: p, timestamp: p.budget_accepted_date, description: `Orçamento ACEITO por: ${p.name}` });
        } else if (p.budget_status === 'Recusado' && p.budget_rejected_date) {
          activities.push({ type: 'budget_rejected', data: p, timestamp: p.budget_rejected_date, description: `Orçamento RECUSADO por: ${p.name}` });
        }
        return activities;
      })
  ]
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  .slice(0, 15);

  return (
    <Card className="bg-white/10 border-white/20 text-white h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Activity className="w-5 h-5 mr-3 text-green-400" />
          Feed de Inteligência
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-0 -mb-4">
            {combinedActivities.length > 0 ? (
              combinedActivities.map((activity, index) => (
                <ActivityItem 
                  key={`${activity.type}-${activity.data.id}-${activity.timestamp}`}
                  activity={activity}
                  index={index}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>Nenhuma atividade recente.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;