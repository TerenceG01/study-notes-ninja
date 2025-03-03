
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/toast";
import { Note, NewNote } from "./types";
import { useOfflineStorage } from "./useOfflineStorage";

export const useNotesOperations = (isOnline: boolean) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingFlashcardsForNote, setGeneratingFlashcardsForNote] = useState<string | null>(null);
  const { saveOfflineNote, getOfflineNotes, clearOfflineNotes } = useOfflineStorage();

  const fetchNotes = async () => {
    try {
      console.log("Fetching notes..."); // Debug log
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Fetched notes:", data); // Debug log
      
      // If we're offline, merge with any offline notes
      if (!navigator.onLine) {
        const offlineNotes = getOfflineNotes();
        setNotes([...offlineNotes, ...(data || [])]);
      } else {
        setNotes(data || []);
      }
    } catch (error) {
      console.error("Error fetching notes:", error); // Debug log
      toast({
        variant: "destructive",
        title: "Error fetching notes",
        description: "Failed to load your notes. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
          const { error } = await supabase.from("notes").insert({
            title: note.title,
            content: note.content,
            tags: note.tags,
            subject: note.subject,
            user_id: note.user_id,
          });
          
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

  const createNote = async (newNote: NewNote, userId: string) => {
    if (!newNote.title || !newNote.content) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in both title and content.",
      });
      return false;
    }

    try {
      if (!isOnline) {
        // Save to local storage for offline use
        const offlineNote = saveOfflineNote(newNote, userId);
        if (offlineNote) {
          setNotes(prev => [offlineNote, ...prev]);
        }
        
        toast({
          title: "Saved offline",
          description: "Your note has been saved locally and will sync when you're back online.",
        });
        return true;
      }
      
      console.log("Creating note:", { ...newNote, user_id: userId }); // Debug log
      const { error } = await supabase.from("notes").insert({
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags,
        subject: newNote.subject,
        user_id: userId,
      });

      if (error) throw error;

      console.log("Note created successfully"); // Debug log

      toast({
        title: "Success",
        description: "Note created successfully!",
      });
      
      // Refresh notes
      await fetchNotes();
      return true;
    } catch (error) {
      console.error("Error creating note:", error); // Debug log
      toast({
        variant: "destructive",
        title: "Error creating note",
        description: "Failed to create note. Please try again.",
      });
      return false;
    }
  };

  const deleteNotesForSubject = async (subject: string) => {
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "You're offline",
        description: "Please connect to the internet to delete notes.",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("subject", subject);

      if (error) throw error;

      await fetchNotes();
      
      toast({
        title: "Success",
        description: `Deleted all notes for subject: ${subject}`,
      });
    } catch (error) {
      console.error("Error deleting notes:", error);
      toast({
        variant: "destructive",
        title: "Error deleting notes",
        description: "Failed to delete notes. Please try again.",
      });
    }
  };

  const addNote = (note: Note) => {
    if (!note.title || !note.content) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in both title and content.",
      });
      return false;
    }

    try {
      // Add new note to state immediately for a responsive UI
      const newNote = {
        ...note,
        id: note.id.toString(), // Ensure ID is a string
        created_at: new Date().toISOString(),
        folder: note.folder || 'My Notes',
      };
      
      setNotes([newNote, ...notes]);
      
      // If online, also send to the server
      if (isOnline) {
        // Get current user ID - Using a placeholder for now
        // In a real app, you would get this from your auth context/state
        const userId = "current-user-id";
        
        supabase.from("notes").insert({
          title: note.title,
          content: note.content,
          tags: note.tags || [],
          subject: note.subject,
          user_id: userId, // Adding the required user_id field
        }).then(({ error }) => {
          if (error) {
            console.error("Error saving note to server:", error);
            toast({
              variant: "destructive",
              title: "Error saving note",
              description: "The note was saved locally, but failed to sync.",
            });
          }
        });
      } else {
        // Save locally when offline
        const offlineNotes = getOfflineNotes();
        offlineNotes.push({
          ...newNote,
          offline: true
        });
        localStorage.setItem('offlineNotes', JSON.stringify(offlineNotes));
      }
      
      return true;
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        variant: "destructive",
        title: "Error adding note",
        description: "Failed to add note. Please try again.",
      });
      return false;
    }
  };

  const updateNote = (note: Note) => {
    try {
      // Update in local state for immediate UI update
      const updatedNotes = notes.map(n => n.id === note.id ? note : n);
      setNotes(updatedNotes);
      
      // If online, also update on the server
      if (isOnline) {
        // Get current user ID - Using a placeholder for now
        const userId = "current-user-id";
        
        supabase.from("notes").update({
          title: note.title,
          content: note.content,
          tags: note.tags || [],
          subject: note.subject,
          summary: note.summary,
          user_id: userId, // Adding the required user_id field
        }).eq("id", note.id).then(({ error }) => {
          if (error) {
            console.error("Error updating note on server:", error);
            toast({
              variant: "destructive",
              title: "Error updating note",
              description: "The note was updated locally, but failed to sync.",
            });
          }
        });
      } else {
        // Handle offline updates
        toast({
          title: "Offline update",
          description: "Note updated locally and will sync when online.",
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Failed to update note. Please try again.",
      });
      return false;
    }
  };

  const deleteNote = (noteId: string) => {
    try {
      // Delete from local state immediately
      setNotes(notes.filter(note => note.id !== noteId));
      
      // If online, also delete from the server
      if (isOnline) {
        supabase.from("notes").delete().eq("id", noteId).then(({ error }) => {
          if (error) {
            console.error("Error deleting note from server:", error);
            toast({
              variant: "destructive",
              title: "Error deleting note",
              description: "The note was removed locally, but failed to delete from server.",
            });
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        variant: "destructive",
        title: "Error deleting note",
        description: "Failed to delete note. Please try again.",
      });
      return false;
    }
  };

  return {
    notes,
    loading,
    generatingFlashcardsForNote,
    setGeneratingFlashcardsForNote,
    fetchNotes,
    syncPendingChanges,
    createNote,
    deleteNotesForSubject,
    addNote,
    updateNote,
    deleteNote
  };
};
