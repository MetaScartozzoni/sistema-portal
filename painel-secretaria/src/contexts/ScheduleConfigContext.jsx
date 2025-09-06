
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { appointmentTypes } from '@/lib/schedulingConfig';

export const ScheduleConfigContext = createContext();

const initialScheduleConfig = [
    // SEGUNDA-FEIRA: Manhã Online/Rápida, Tarde Pós-Op
    { id: 1, day_of_week: 1, event_type: appointmentTypes.CONSULTA_ONLINE.label, start_time: '09:00', end_time: '11:00' },
    { id: 2, day_of_week: 1, event_type: appointmentTypes.BATE_PAPO.label, start_time: '11:00', end_time: '12:00' },
    { id: 3, day_of_week: 1, event_type: appointmentTypes.RETORNO_POS_OPERATORIO.label, start_time: '14:30', end_time: '18:00' },

    // TERÇA-FEIRA: Manhã Retornos, Tarde Foco em Primeira Consulta
    { id: 4, day_of_week: 2, event_type: appointmentTypes.RETORNO_POS_CONSULTA.label, start_time: '09:00', end_time: '12:00' },
    { id: 5, day_of_week: 2, event_type: appointmentTypes.PRIMEIRA_CONSULTA.label, start_time: '14:30', end_time: '18:00' },

    // QUARTA-FEIRA: Dia da Primeira Consulta
    { id: 6, day_of_week: 3, event_type: appointmentTypes.PRIMEIRA_CONSULTA.label, start_time: '09:00', end_time: '12:00' },
    { id: 7, day_of_week: 3, event_type: appointmentTypes.PRIMEIRA_CONSULTA.label, start_time: '14:30', end_time: '18:00' },
    
    // QUINTA-FEIRA: Dia Cirúrgico (com Encaixe Pós-Cirurgia)
    { id: 8, day_of_week: 4, event_type: appointmentTypes.CIRURGIA.label, start_time: '08:00', end_time: '18:00' },
    // A lógica de encaixe será tratada em `calendarUtils` e não por uma regra separada aqui.

    // SEXTA-FEIRA: Dia Online/Flexível
    { id: 9, day_of_week: 5, event_type: appointmentTypes.CONSULTA_ONLINE.label, start_time: '09:00', end_time: '12:00' },
    { id: 10, day_of_week: 5, event_type: appointmentTypes.BATE_PAPO.label, start_time: '14:30', end_time: '16:00' },
    { id: 11, day_of_week: 5, event_type: appointmentTypes.RETORNO_POS_CONSULTA.label, start_time: '16:00', end_time: '18:00' },
    
    // BLOQUEIOS (Almoço, etc.) - Ocultos na UI
    // Almoço Funcionários (Geral)
    { id: 101, day_of_week: 1, event_type: appointmentTypes.ALMOCO_FUNCIONARIOS.label, start_time: '12:00', end_time: '13:00', is_hidden: true },
    { id: 102, day_of_week: 2, event_type: appointmentTypes.ALMOCO_FUNCIONARIOS.label, start_time: '12:00', end_time: '13:00', is_hidden: true },
    { id: 103, day_of_week: 3, event_type: appointmentTypes.ALMOCO_FUNCIONARIOS.label, start_time: '12:00', end_time: '13:00', is_hidden: true },
    { id: 104, day_of_week: 4, event_type: appointmentTypes.ALMOCO_MEDICO.label, start_time: '12:00', end_time: '13:00', is_hidden: true }, // Almoço do médico na quinta é mais curto
    { id: 105, day_of_week: 5, event_type: appointmentTypes.ALMOCO_FUNCIONARIOS.label, start_time: '12:00', end_time: '13:00', is_hidden: true },

    // Almoço Médico (Estendido)
    { id: 201, day_of_week: 1, event_type: appointmentTypes.ALMOCO_MEDICO.label, start_time: '13:00', end_time: '14:30', is_hidden: true },
    { id: 202, day_of_week: 2, event_type: appointmentTypes.ALMOCO_MEDICO.label, start_time: '13:00', end_time: '14:30', is_hidden: true },
    { id: 203, day_of_week: 3, event_type: appointmentTypes.ALMOCO_MEDICO.label, start_time: '13:00', end_time: '14:30', is_hidden: true },
    // Quinta já coberta acima
    { id: 205, day_of_week: 5, event_type: appointmentTypes.ALMOCO_MEDICO.label, start_time: '13:00', end_time: '14:30', is_hidden: true },
];

export const ScheduleConfigProvider = ({ children }) => {
  const [scheduleConfig, setScheduleConfig] = useState(initialScheduleConfig);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchConfig = useCallback(() => {
    setLoading(true);
    // Em um cenário real, aqui seria a busca no Supabase
    // Por enquanto, usamos os dados locais
    setScheduleConfig(initialScheduleConfig);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const addRule = useCallback((newRule) => {
    // Simula a adição local
    const ruleWithId = { ...newRule, id: Date.now() };
    setScheduleConfig(prev => [...prev, ruleWithId]);
    toast({ title: 'Sucesso!', description: 'Nova regra de agendamento adicionada (localmente).' });
  }, [toast]);

  const deleteRule = useCallback((id) => {
    // Simula a deleção local
    setScheduleConfig(prev => prev.filter(rule => rule.id !== id));
    toast({ title: 'Sucesso!', description: 'Regra de agendamento removida (localmente).' });
  }, [toast]);

  const value = useMemo(() => ({
    scheduleConfig,
    loading,
    tableExists: true, // Assume table exists in local mode
    refreshConfig: fetchConfig,
    addRule,
    deleteRule,
  }), [scheduleConfig, loading, fetchConfig, addRule, deleteRule]);

  return (
    <ScheduleConfigContext.Provider value={value}>
      {children}
    </ScheduleConfigContext.Provider>
  );
};
