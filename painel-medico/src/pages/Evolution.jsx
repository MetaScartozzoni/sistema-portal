import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import EvolutionHeader from '@/components/evolution/EvolutionHeader';
import EvolutionStats from '@/components/evolution/EvolutionStats';
import EvolutionPatientCard from '@/components/evolution/EvolutionPatientCard';

const Evolution = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    monitoring: 0,
    stable: 0,
    pending: 0
  });

  useEffect(() => {
    const mockPatients = [
      {
        id: '2',
        name: 'João Carlos Lima',
        procedure: 'Abdominoplastia',
        status: 'monitoring',
        surgeryDate: '2025-08-01',
        lastEvolution: '2025-08-10',
        nextAppointment: '2025-08-20',
        vitals: { weight: '84', edema: '2+', drainVolume: '50', painScale: [4] },
        woundState: 'Apresenta boa cicatrização, sem sinais de infecção.',
        complaint: 'Relata dor moderada na área da incisão.'
      },
      {
        id: '3',
        name: 'Ana Costa Ferreira',
        procedure: 'Mamoplastia',
        status: 'stable',
        surgeryDate: '2025-07-20',
        lastEvolution: '2025-08-05',
        nextAppointment: '2025-09-05',
        vitals: { weight: '65', edema: '1+', drainVolume: '0', painScale: [1] },
        woundState: 'Cicatriz com bom aspecto, sem rubor ou calor.',
        complaint: 'Nenhuma queixa, sente-se bem.'
      },
      {
        id: '4',
        name: 'Carlos Eduardo Souza',
        procedure: 'Lipoaspiração',
        status: 'pending',
        surgeryDate: '2025-08-08',
        lastEvolution: '2025-08-10',
        nextAppointment: '2025-08-17',
        vitals: { weight: '92', edema: '3+', drainVolume: '100', painScale: [6] },
        woundState: 'Aguardando avaliação da ferida no retorno.',
        complaint: 'Aguardando retorno para avaliação inicial.'
      },
      {
        id: '1',
        name: 'Maria Silva Santos',
        procedure: 'Rinoplastia',
        status: 'monitoring',
        surgeryDate: '2025-08-10',
        lastEvolution: '2025-08-12',
        nextAppointment: '2025-08-18',
        vitals: { weight: '58', edema: '2+', drainVolume: '', painScale: [3] },
        woundState: 'Edema nasal significativo, mas esperado. Sem sinais de sangramento ativo.',
        complaint: 'Dificuldade para respirar pelo nariz devido ao inchaço.'
      }
    ];
    
    setPatients(mockPatients);
    
    const newStats = mockPatients.reduce((acc, patient) => {
      if (acc[patient.status] !== undefined) {
        acc[patient.status]++;
      }
      return acc;
    }, { monitoring: 0, stable: 0, pending: 0 });
    
    setStats(newStats);
  }, []);

  const handleSaveEvolution = (patientId, data) => {
    toast({ title: "Evolução salva com sucesso!", description: "Os dados do paciente foram atualizados." });
    console.log("Saving evolution for patient:", patientId, data);
    
    setPatients(prevPatients => 
      prevPatients.map(p => 
        p.id === patientId 
        ? {
            ...p,
            status: data.status,
            nextAppointment: data.nextDate,
            vitals: data.vitals,
            woundState: data.woundState,
            complaint: data.complaint,
            lastEvolution: new Date().toISOString().split('T')[0]
          }
        : p
      )
    );
  };

  return (
    <div className="space-y-6">
      <EvolutionHeader />
      <EvolutionStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patients.map((patient, index) => (
          <EvolutionPatientCard
            key={patient.id}
            patient={patient}
            index={index}
            onSaveEvolution={handleSaveEvolution}
          />
        ))}
      </div>
    </div>
  );
};

export default Evolution;