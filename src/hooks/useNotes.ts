
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

export type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder: string;
  summary?: string;
  tags?: string[];
  subject?: string;
  subject_color?: string;
  subject_order?: number;
  custom_color?: string;
};

export type NewNote = {
  title: string;
  content: string;
  tags: string[];
  subject: string;
};

export const useNotes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingFlashcardsForNote, setGeneratingFlashcardsForNote] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Define fetchNotes function before using it in useEffect
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
  }, []);

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
      localStorage.removeItem('offlineNotes');
      
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
  
  useEffect(() => {
    fetchNotes();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes'
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          fetchNotes(); // Refresh notes when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
        saveOfflineNote(newNote, userId);
        
        toast({
          title: "Saved offline",
          description: "Your note has been saved locally and will sync when you're back online.",
        });
        return true;
      }
      
      console.log("Creating note:", { ...newNote, user_id: userId }); // Debug log
      const { error } = await supabase.from("notes").insert([
        {
          title: newNote.title,
          content: newNote.content,
          tags: newNote.tags,
          subject: newNote.subject,
          user_id: userId,
        },
      ]);

      if (error) throw error;

      console.log("Note created successfully"); // Debug log

      toast({
        title: "Success",
        description: "Note created successfully!",
      });
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

  // Define offline storage helpers
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
      
      // Update local state to include the new offline note
      setNotes(prevNotes => [{
        ...note,
        id: `offline_${Date.now()}`,
        created_at: new Date().toISOString(),
        folder: '',
        offline: true
      } as Note, ...prevNotes]);
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

  const generateFlashcards = async (note: Note) => {
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "You're offline",
        description: "Please connect to the internet to generate flashcards.",
      });
      return;
    }
    
    try {
      setGeneratingFlashcardsForNote(note.id);
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: {
          noteId: note.id,
          content: note.content,
          title: note.title,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: `Created ${data.flashcardsCount} flashcards! You can find them in your flashcard decks.`,
        });
        navigate(`/flashcards/${data.deckId}`);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating flashcards",
        description: "Failed to generate flashcards. Please try again.",
      });
    } finally {
      setGeneratingFlashcardsForNote(null);
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

  return {
    notes,
    loading,
    generatingFlashcardsForNote,
    isOnline,
    fetchNotes,
    createNote,
    generateFlashcards,
    deleteNotesForSubject,
  };
};
