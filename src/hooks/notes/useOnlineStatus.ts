
import { useState, useEffect } from "react";
import { toast } from "@/hooks/toast";

export const useOnlineStatus = (syncPendingChanges: () => Promise<void>) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Attempt to sync any pending changes
      syncPendingChanges();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Changes will be saved locally and synced when you reconnect.",
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingChanges]);

  return { isOnline };
};
