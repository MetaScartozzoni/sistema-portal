
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NextActionCard = ({ action, patient, onCall }) => {
  if (!action) return null;

  return (
    <Card className={`${action.isUrgent ? 'bg-green-900/30 border-green-500' : 'bg-yellow-900/30 border-yellow-500'}`}>
      <CardHeader>
        <CardTitle className={`text-base flex items-center ${action.isUrgent ? 'text-green-200' : 'text-yellow-200'}`}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          {action.isUrgent ? 'Ação Urgente' : 'Ação Sugerida'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm mb-3 font-semibold ${action.isUrgent ? 'text-green-200' : 'text-yellow-200'}`}>{action.label}</p>
        <Button 
          className={`w-full ${action.isUrgent ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`} 
          onClick={action.handler}>
          {React.createElement(action.icon, { className: "w-4 h-4 mr-2" })}
          {action.buttonLabel || action.label}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NextActionCard;
