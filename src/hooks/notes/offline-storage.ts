
import { Note, NewNote } from "./types";

// Function to save offline note
export const saveOfflineNote = (note: NewNote, userId: string) => {
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
    return true;
  } catch (error) {
    console.error("Error saving offline note:", error);
    return false;
  }
};

// Function to get all offline notes
export const getOfflineNotes = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('offlineNotes') || '[]');
  } catch (error) {
    console.error("Error retrieving offline notes:", error);
    return [];
  }
};

// Function to cache notes for offline use
export const cacheNotesForOffline = (notes: Note[]) => {
  if (notes?.length) {
    localStorage.setItem('cachedNotes', JSON.stringify(notes));
  }
};

// Function to get cached notes
export const getCachedNotes = (): Note[] => {
  try {
    const cachedNotes = localStorage.getItem('cachedNotes');
    return cachedNotes ? JSON.parse(cachedNotes) : [];
  } catch (error) {
    console.error("Error retrieving cached notes:", error);
    return [];
  }
};

// Function to clear offline notes
export const clearOfflineNotes = () => {
  localStorage.removeItem('offlineNotes');
};
