import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  MixerHorizontalIcon, 
  CalendarIcon,
  MobileIcon,
  EnvelopeClosedIcon,
  FileTextIcon,
  IdCardIcon
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Patients = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);

  // Mock data - em produção viria do Supabase
  useEffect(() => {
    const mockPatients = [
      {
        id: '1',
        name: 'Maria Silva Santos',
        phone: '(11) 99999-9999',
        email: 'maria.silva@email.com',
        lastVisit: '2024-01-15',
        status: 'Ativo',
        procedure: 'Rinoplastia',
        stage: 'Pós-operatório'
      },
      {
        id: '2',
        name: 'João Carlos Lima',
        phone: '(11) 88888-8888',
        email: 'joao.lima@email.com',
        lastVisit: '2024-01-10',
        status: 'Ativo',
        procedure: 'Abdominoplastia',
        stage: 'Consulta inicial'
      },
      {
        id: '3',
        name: 'Ana Costa Ferreira',
        phone: '(11) 77777-7777',
        email: 'ana.costa@email.com',
        lastVisit: '2024-01-08',
        status: 'Ativo',
        procedure: 'Mamoplastia',
        stage: 'Pré-operatório'
      },
      {
        id: '4',
        name: 'Carlos Eduardo Souza',
        phone: '(11) 66666-6666',
        email: 'carlos.souza@email.com',
        lastVisit: '2024-01-05',
        status: 'Ativo',
        procedure: 'Lipoaspiração',
        stage: 'Recuperação'
      }
    ];
    setPatients(mockPatients);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrcamentoClick = () => {
    window.open('https://orcamento.marcioplasticsurgery.com', '_blank');
  };

  const handleNewPatient = () => {
    toast({ title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" });
  };

  const handleFilter = () => {
    toast({ title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Pacientes</h1>
          <p className="text-slate-400 mt-2">Gerencie todos os seus pacientes</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleOrcamentoClick} variant="shine" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <IdCardIcon className="w-4 h-4 mr-2" />
            Orçamento
          </Button>
          <Button onClick={handleNewPatient} variant="shine">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Paciente
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          <Button variant="outline" onClick={handleFilter} className="border-slate-600 hover:border-blue-500">
            <MixerHorizontalIcon className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </motion.div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-effect rounded-xl p-6 hover:bg-slate-700/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{patient.name}</h3>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                  {patient.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MobileIcon className="w-4 h-4 text-slate-400" />
                {patient.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <EnvelopeClosedIcon className="w-4 h-4 text-slate-400" />
                {patient.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                Última visita: {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-400">Procedimento</p>
              <p className="text-white font-medium">{patient.procedure}</p>
              <p className="text-sm text-blue-400">{patient.stage}</p>
            </div>

            <div className="flex gap-2">
              <Link to={`/patients/${patient.id}/caderno`} className="flex-1">
                <Button variant="outline" className="w-full border-slate-600 hover:border-blue-500 hover:bg-blue-500/10">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Caderno
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="glass-effect rounded-xl p-8 max-w-md mx-auto">
            <MagnifyingGlassIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum paciente encontrado</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece adicionando um novo paciente'}
            </p>
            <Button onClick={handleNewPatient} variant="shine">
              <PlusIcon className="w-4 h-4 mr-2" />
              Adicionar Paciente
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Patients;