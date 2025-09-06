import React from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

const Teleconsultas = () => {
  const wherebyRoomUrl = "https://marcioplasticsurgery.whereby.com";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-blue-400" />
            Sala de Teleconsulta
          </h1>
          <p className="text-slate-400 mt-2">Sua sala de reuniões virtual para atendimentos online.</p>
        </div>
      </div>

      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="aspect-video">
          <whereby-embed
            room={wherebyRoomUrl}
            background="off"
            lang="pt"
            displayName="Médico"
            className="w-full h-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Teleconsultas;