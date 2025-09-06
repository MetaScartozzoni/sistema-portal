import React from 'react';
import { motion } from 'framer-motion';

const PatientHeader = ({ patient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-xl p-4 w-full"
    >
      <h2 className="text-base font-semibold text-white mb-2">Dados do Paciente</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-xs text-slate-400">Nome</p>
          <p className="text-white font-medium truncate">{patient.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Telefone</p>
          <p className="text-white font-medium">{patient.phone}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Email</p>
          <p className="text-white font-medium truncate">{patient.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Nascimento</p>
          <p className="text-white font-medium">{new Date(patient.birthDate).toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">CPF</p>
          <p className="text-white font-medium">{patient.cpf}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-400">Endereço</p>
          <p className="text-white font-medium truncate">{patient.address}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientHeader;