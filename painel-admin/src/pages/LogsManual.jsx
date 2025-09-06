import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { BookOpen, AlertTriangle, CheckCircle, XCircle, Wrench, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

const LogsManual = () => {
  const { logsManual } = useData();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  if (!logsManual) {
    return null; // or a loading spinner
  }

  const getIcon = (id) => {
    if (id.includes('API')) return <XCircle className="w-6 h-6 text-red-400" />;
    if (id.includes('PERM')) return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
    return <CheckCircle className="w-6 h-6 text-green-400" />;
  };

  return (
    <>
      <Helmet>
        <title>Manual de Logs - Portal Admin Clínica</title>
        <meta name="description" content="Entenda os logs do sistema, seus significados e as ações recomendadas para cada tipo de evento." />
      </Helmet>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Manual de Logs</h1>
          </div>
          <p className="text-gray-400">Entenda os eventos do sistema e saiba como agir.</p>
        </motion.div>

        <div className="space-y-6">
          {Object.entries(logsManual).map(([id, data], index) => (
            <motion.div
              key={id}
              id={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="scroll-mt-24"
            >
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon(id)}</div>
                    <div>
                      <CardTitle className="text-xl text-white">{data.title}</CardTitle>
                      <CardDescription className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded inline-block mt-1">
                        ID do Log: {id}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-300">{data.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Wrench className="w-4 h-4 text-green-400" />Ações Rápidas</h3>
                      <ul className="space-y-2 list-inside">
                        {data.quickActions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><ArrowRight className="w-4 h-4 text-purple-400" />Próximos Passos</h3>
                      <p className="text-sm text-gray-300">{data.nextSteps}</p>
                    </div>
                  </div>

                  <div>
                      <h3 className="font-semibold text-white mb-3">Causas Comuns</h3>
                      <div className="flex flex-wrap gap-2">
                        {data.causes.map((cause, i) => (
                            <span key={i} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">{cause}</span>
                        ))}
                      </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LogsManual;