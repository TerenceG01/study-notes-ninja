
export const useOfflineNotes = () => {
  const saveOfflineNote = (note: any, userId: string) => {
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
    } catch (error) {
      console.error("Error saving offline note:", error);
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
    try {
      localStorage.removeItem('offlineNotes');
    } catch (error) {
      console.error("Error clearing offline notes:", error);
    }
  };

  return {
    saveOfflineNote,
    getOfflineNotes,
    clearOfflineNotes
  };
};
