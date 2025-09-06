// components/messages/MessageList.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MessageList = ({ messages, selectedMessage, onSelectMessage }) => {
  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'patient': return '👤';
      case 'doctor': return '👨‍⚕️';
      case 'lab': return '🔬';
      case 'insurance': return '🏥';
      case 'bot': return <Bot className="w-5 h-5 text-cyan-400" />;
      default: return '📧';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    return isToday
      ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Caixa de Entrada</CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin">
          {messages.map((message, index) => {
            const isSelected = selectedMessage?.id === message.id;
            const isUnread = message.status === 'unread';

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={[
                  'p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-all duration-200',
                  isSelected && 'bg-blue-500/10 border-l-4 border-l-blue-400',
                  isUnread && 'bg-white/5',
                ].filter(Boolean).join(' ')}
                onClick={() => onSelectMessage(message)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg w-5 h-5 flex items-center justify-center">
                    {getMessageTypeIcon(message.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium truncate ${isUnread ? 'text-white' : 'text-gray-300'}`}>
                        {message.from}
                      </p>
                      <div className="flex items-center space-x-1 shrink-0">
                        {message.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400" />}
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm truncate mb-1 ${isUnread ? 'text-white' : 'text-gray-400'}`}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{message.preview}</p>
                    {message.priority === 'urgent' && (
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-xs text-red-400">Urgente</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageList;