import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Clock } from 'lucide-react';

const AuditLogItem = ({ log, index }) => {
  const getActionColor = (action) => {
    if (action.includes('created')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (action.includes('updated')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (action.includes('deleted')) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (action.includes('login')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start space-x-4 p-4 border-b border-white/10"
    >
      <div className={`mt-1 p-2 rounded-full ${getActionColor(log.action)}`}>
        <FileText className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-white">{log.action.replace(/_/g, ' ')}</p>
          <Badge variant="outline" className={getActionColor(log.action)}>
            {log.user_role || 'System'}
          </Badge>
        </div>
        <div className="text-sm text-gray-300 mt-1">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3" />
            <span>{log.user_full_name || 'Usuário do Sistema'}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3" />
            <time dateTime={log.created_at}>
              {new Date(log.created_at).toLocaleString('pt-BR')}
            </time>
          </div>
        </div>
        {log.details && (
          <div className="mt-2 text-xs text-gray-400 bg-black/20 p-2 rounded-md font-mono">
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AuditoriaView = ({ auditLogs }) => {
  return (
    <motion.div
      key="auditoria"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Trilha de Auditoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-280px)]">
            {auditLogs.length > 0 ? (
              auditLogs.map((log, index) => (
                <AuditLogItem key={log.id} log={log} index={index} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>Nenhum registro de auditoria encontrado.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuditoriaView;