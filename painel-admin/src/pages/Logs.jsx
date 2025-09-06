import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter, Download, AlertCircle, CheckCircle, XCircle, Info, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Logs = () => {
  const { logs } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'error':
        return 'Erro';
      case 'warning':
        return 'Aviso';
      case 'info':
        return 'Info';
      default:
        return 'Debug';
    }
  };

  const handleExport = () => {
    toast({
      title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
      description: "Exportação de logs",
    });
  };

  const logStats = {
    total: logs.length,
    error: logs.filter(l => l.level === 'error').length,
    warning: logs.filter(l => l.level === 'warning').length,
    info: logs.filter(l => l.level === 'info').length
  };

  return (
    <>
      <Helmet>
        <title>Logs - Portal Admin Clínica</title>
        <meta name="description" content="Visualize e monitore logs do sistema da clínica, incluindo atividades de usuários, erros e eventos importantes." />
        <meta property="og:title" content="Logs - Portal Admin Clínica" />
        <meta property="og:description" content="Visualize e monitore logs do sistema da clínica, incluindo atividades de usuários, erros e eventos importantes." />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Logs do Sistema</h1>
            <p className="text-gray-400">Monitore atividades e eventos do sistema</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Link to="/logs/manual">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <BookOpen className="w-4 h-4 mr-2" />
                Manual de Logs
              </Button>
            </Link>
            <Button 
              onClick={handleExport}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Logs
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-effect border-white/10"><CardContent className="p-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-blue-400" /></div><div><p className="text-gray-400 text-sm">Total</p><p className="text-white text-xl font-bold">{logStats.total}</p></div></div></CardContent></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-effect border-white/10"><CardContent className="p-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center"><XCircle className="w-5 h-5 text-red-400" /></div><div><p className="text-gray-400 text-sm">Erros</p><p className="text-white text-xl font-bold">{logStats.error}</p></div></div></CardContent></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-effect border-white/10"><CardContent className="p-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center"><AlertCircle className="w-5 h-5 text-yellow-400" /></div><div><p className="text-gray-400 text-sm">Avisos</p><p className="text-white text-xl font-bold">{logStats.warning}</p></div></div></CardContent></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-effect border-white/10"><CardContent className="p-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-400" /></div><div><p className="text-gray-400 text-sm">Info</p><p className="text-white text-xl font-bold">{logStats.info}</p></div></div></CardContent></Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Buscar logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400" />
          </div>
          <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Todos os níveis</option>
            <option value="error">Erros</option>
            <option value="warning">Avisos</option>
            <option value="info">Informações</option>
          </select>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="glass-effect border-white/10">
            <CardHeader><CardTitle className="text-white">Logs Recentes</CardTitle></CardHeader>
            <CardContent>
              {filteredLogs.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">{getLevelIcon(log.level)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(log.level)}`}>{getLevelText(log.level)}</span>
                            <span className="text-gray-400 text-sm">{log.action}</span>
                            {log.errorCode && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link to={`/logs/manual#${log.errorCode}`}>
                                      <span className="text-xs text-blue-400 hover:underline cursor-pointer font-mono bg-blue-500/10 px-2 py-1 rounded">
                                        {log.errorCode}
                                      </span>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ver no Manual de Logs</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <span className="text-gray-400 text-xs flex-shrink-0">{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                        </div>
                        <p className="text-white text-sm mb-1">{log.description}</p>
                        <p className="text-gray-400 text-xs">Usuário: {log.user}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-gray-400" /></div>
                  <h3 className="text-white text-lg font-semibold mb-2">Nenhum log encontrado</h3>
                  <p className="text-gray-400">Tente ajustar os filtros de busca</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Logs;