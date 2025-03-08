
import { supabase } from "@/integrations/supabase/client";
import { useOfflineNotes } from "./useOfflineNotes";

interface UseNotesSyncProps {
  fetchNotes: () => Promise<void>;
  setNotes: React.Dispatch<React.SetStateAction<any[]>>;
  toast: any;
}

export const useNotesSync = ({ fetchNotes, setNotes, toast }: UseNotesSyncProps) => {
  const { getOfflineNotes, clearOfflineNotes } = useOfflineNotes();
  
  // Function to sync pending changes when back online
  const syncPendingChanges = async () => {
    const offlineNotes = getOfflineNotes();
    
    if (offlineNotes.length > 0) {
      const syncToastId = toast({
        title: "Back online",
        description: `Syncing ${offlineNotes.length} offline notes...`,
      }).id;
      
      let syncedCount = 0;
      
      for (const note of offlineNotes) {
        try {
          const { error } = await supabase.from("notes").insert([
            {
              title: note.title,
              content: note.content,
              tags: note.tags,
              subject: note.subject,
              user_id: note.user_id,
            },
          ]);
          
          if (!error) {
            syncedCount++;
          }
        } catch (error) {
          console.error("Error syncing offline note:", error);
        }
      }
      
      // Clear offline notes after sync attempt
      clearOfflineNotes();
      
      // Dismiss the syncing toast
      toast.dismiss(syncToastId);
      
      // Show result toast
      toast({
        title: "Sync complete",
        description: `Successfully synced ${syncedCount} of ${offlineNotes.length} notes.`,
      });
      
      // Refresh notes to include synced items
      await fetchNotes();
    } else {
      toast({
        title: "Back online",
        description: "Your connection has been restored.",
      });
      
      // Refresh notes
      await fetchNotes();
    }
  };

  return {
    syncPendingChanges
  };
};
