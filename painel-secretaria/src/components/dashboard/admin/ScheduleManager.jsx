
import React, { useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ScheduleConfigContext } from '@/contexts/ScheduleConfigContext';
import { Button } from '@/components/ui/button';
import { Trash2, PlusCircle } from 'lucide-react';
import { appointmentTypes, getAppointmentTypeDetails } from '@/lib/schedulingConfig';

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const ScheduleManager = () => {
  const { scheduleConfig, loading, deleteRule } = useContext(ScheduleConfigContext);
  const { toast } = useToast();

  const handleAddRule = () => {
    toast({
      title: 'Função não implementada',
      description: 'A adição de novas regras será implementada em breve.',
    });
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-4">
        <div/>
        <Button onClick={handleAddRule} className="bg-green-500 hover:bg-green-600">
          <PlusCircle className="w-4 h-4 mr-2" />
          Adicionar Regra
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-slate-800/60">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-6">Dia da Semana</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Tipo de Evento</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Horário</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan="4" className="text-center p-4">Carregando regras...</td></tr>
            ) : (
              scheduleConfig
                .filter(rule => !rule.is_hidden)
                .sort((a,b) => a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time))
                .map((rule) => {
                  const details = getAppointmentTypeDetails(rule.event_type);
                  return (
                    <tr key={rule.id} className="hover:bg-slate-800/40">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{weekDays[rule.day_of_week]}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${details.color}`}></div>
                           <span>{rule.event_type}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{`${rule.start_time} - ${rule.end_time}`}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  )
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleManager;
