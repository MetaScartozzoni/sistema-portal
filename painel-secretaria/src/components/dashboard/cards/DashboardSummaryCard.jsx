
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const cardVariants = {
  unselected: {
    scale: 1,
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
  },
  selected: {
    scale: 1.05,
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.4)',
  },
};

const DashboardSummaryCard = ({ icon: Icon, title, value, color, tooltipText, onClick, isSelected, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            variants={cardVariants}
            animate={isSelected ? 'selected' : 'unselected'}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="h-full cursor-pointer"
            onClick={onClick}
          >
            <Card className={`relative overflow-hidden h-full border-0 text-white bg-gradient-to-br ${color}`}>
               {isSelected && (
                <div className="absolute inset-0 bg-white/25 rounded-lg"></div>
              )}
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Icon className="w-28 h-28" />
              </div>
              <CardContent className="p-4 flex flex-col justify-between h-full relative z-10">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium uppercase tracking-wider">{title}</p>
                    <Icon className="w-6 h-6 text-white/70" />
                  </div>
                  {value !== undefined && (
                    <p className="text-4xl font-bold mt-2">{value}</p>
                  )}
                </div>
                {children && <div className="mt-2">{children}</div>}
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DashboardSummaryCard;
