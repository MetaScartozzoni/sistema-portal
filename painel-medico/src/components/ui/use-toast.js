import * as React from 'react';
import { ToastContext } from '@/components/ui/ToastProvider';

const useToast = () => {
  const context = React.useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

const toast = () => {
    throw new Error('Toast called outside of a ToastProvider');
}

export { useToast, toast };