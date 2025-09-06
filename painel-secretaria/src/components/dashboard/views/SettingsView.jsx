
import React from 'react';
import { motion } from 'framer-motion';
import ScheduleManager from '@/components/dashboard/admin/ScheduleManager';

const SettingsView = () => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="text-3xl font-bold text-white mb-6">Configurações</h1>
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Gerenciador de Agenda</h2>
        <p className="text-gray-300 mb-6">
          Defina os horários e tipos de eventos disponíveis para cada dia da semana. As alterações feitas aqui serão refletidas no calendário de agendamentos.
        </p>
        <ScheduleManager />
      </div>
    </motion.div>
  );
};

export default SettingsView;
