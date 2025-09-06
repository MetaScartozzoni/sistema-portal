import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const IntegrationCard = ({ icon, title, description, children }) => (
  <Card className="glass-effect-strong text-foreground hover:shadow-lg transition-shadow duration-300 flex flex-col">
    <CardHeader className="flex flex-row items-center space-x-4 pb-4">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
        {icon}
      </div>
      <div>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col">{children}</CardContent>
  </Card>
);

export default IntegrationCard;