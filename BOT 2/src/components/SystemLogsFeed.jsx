import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ListChecks } from 'lucide-react';

const SystemLogsFeed = ({ logs }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  const getSectorColor = (sector) => {
    switch (sector) {
      case 'Sistema': return 'bg-blue-500 text-white';
      case 'Atendimento': return 'bg-purple-500 text-white';
      case 'Gerenciamento': return 'bg-green-500 text-white';
      case 'Contatos': return 'bg-yellow-500 text-white';
      case 'Configurações': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const recentLogs = logs
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10); // Displaying up to 10 recent logs

  return (
    <Card className="h-full glass-effect-strong text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-foreground">
          <ListChecks className="h-5 w-5 text-green-400" />
          <span>Logs do Sistema</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {recentLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex-shrink-0 p-2 rounded-full bg-secondary">
                <ListChecks className="h-5 w-5 text-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-foreground truncate">
                    {log.action}
                  </span>
                  <Badge className={`text-xs ${getSectorColor(log.sector)}`}>
                    {log.sector}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {log.details}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatTime(log.timestamp)} por {log.user}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemLogsFeed;