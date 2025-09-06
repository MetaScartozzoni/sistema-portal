
import React, { useEffect } from 'react';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useNotifications = () => {
  const { user } = useAuth();
  const { setNotifications, settings } = useNotificationContext();
  const { toast } = useToast();

  useEffect(() => {
    // This hook is disabled in local mode as it depends on Supabase Realtime.
    if (!user) return;
    console.log("useNotifications hook is active for user:", user.id);
  }, [user, setNotifications, settings, toast]);
};
