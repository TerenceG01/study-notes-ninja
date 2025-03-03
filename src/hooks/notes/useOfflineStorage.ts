
import { toast } from "@/hooks/toast";
import { Note, NewNote } from "./types";

export const useOfflineStorage = () => {
  const saveOfflineNote = (note: NewNote, userId: string) => {
    try {
      const offlineNotes = getOfflineNotes();
      offlineNotes.push({
        ...note,
        user_id: userId,
        id: `offline_${Date.now()}`,
        created_at: new Date().toISOString(),
        offline: true
      });
      localStorage.setItem('offlineNotes', JSON.stringify(offlineNotes));
      
      return {
        ...note,
        id: `offline_${Date.now()}`,
        created_at: new Date().toISOString(),
        folder: '',
        offline: true
      } as Note;
    } catch (error) {
      console.error("Error saving offline note:", error);
      return null;
    }
  };
  
  const getOfflineNotes = (): any[] => {
    try {
      return JSON.parse(localStorage.getItem('offlineNotes') || '[]');
    } catch (error) {
      console.error("Error retrieving offline notes:", error);
      return [];
    }
  };

  const clearOfflineNotes = () => {
    localStorage.removeItem('offlineNotes');
  };

  return {
    saveOfflineNote,
    getOfflineNotes,
    clearOfflineNotes
  };
};
