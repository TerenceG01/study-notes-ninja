
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Note, NewNote } from "./notes/types";
import { 
  fetchNotes,
  createNoteInDb,
  generateFlashcardsForNote,
  deleteNotesForSubject,
  syncOfflineNotes
} from "./notes/note-operations";
import {
  saveOfflineNote,
  getOfflineNotes,
  cacheNotesForOffline,
  clearOfflineNotes
} from "./notes/offline-storage";

export type { Note, NewNote };

export const useNotes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [generatingFlashcardsForNote, setGeneratingFlashcardsForNote] = useState<string | null>(null);
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
  }, []);

  const { data: notes, isLoading: loading, refetch } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: fetchNotes,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes - replaced cacheTime with gcTime
    onSuccess: (data) => {
      // Cache for offline use
      if (data?.length) {
        cacheNotesForOffline(data);
      }
    },
    meta: {
      errorToast: true
    }
  });

  // Function to sync pending changes when back online
  const syncPendingChanges = async () => {
    if (!user) return;
    
    const offlineNotes = getOfflineNotes();
    
    if (offlineNotes.length > 0) {
      const syncToastId = toast({
        title: "Back online",
        description: `Syncing ${offlineNotes.length} offline notes...`,
      }).id;
      
      const { syncedCount, totalCount } = await syncOfflineNotes(user.id);
      
      // Clear offline notes after sync attempt
      clearOfflineNotes();
      
      // Dismiss the syncing toast
      toast.dismiss(syncToastId);
      
      // Show result toast
      toast({
        title: "Sync complete",
        description: `Successfully synced ${syncedCount} of ${totalCount} notes.`,
      });
      
      // Refresh notes to include synced items
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    } else {
      toast({
        title: "Back online",
        description: "Your connection has been restored.",
      });
      
      // Refresh notes
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    }
  };
  
  useEffect(() => {
    if (!user) return;
    
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
          queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const createNoteMutation = useMutation({
    mutationFn: async ({ newNote, userId }: { newNote: NewNote; userId: string }) => {
      if (!newNote.title || !newNote.content) {
        throw new Error("Missing fields: Please fill in both title and content.");
      }
      
      if (!isOnline) {
        // Save to local storage for offline use
        saveOfflineNote(newNote, userId);
        return { offline: true };
      }
      
      return await createNoteInDb(newNote, userId);
    },
    onSuccess: (result) => {
      if (result.offline) {
        toast({
          title: "Saved offline",
          description: "Your note has been saved locally and will sync when you're back online.",
        });
      } else {
        toast({
          title: "Success",
          description: "Note created successfully!",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      toast({
        variant: "destructive",
        title: "Error creating note",
        description: error instanceof Error ? error.message : "Failed to create note. Please try again.",
      });
    }
  });

  const createNote = async (newNote: NewNote, userId: string) => {
    try {
      await createNoteMutation.mutateAsync({ newNote, userId });
      return true;
    } catch (error) {
      return false;
    }
  };

  const generateFlashcardsMutation = useMutation({
    mutationFn: async (note: Note) => {
      if (!isOnline) {
        throw new Error("You're offline. Please connect to the internet to generate flashcards.");
      }
      
      setGeneratingFlashcardsForNote(note.id);
      try {
        return await generateFlashcardsForNote(note);
      } finally {
        setGeneratingFlashcardsForNote(null);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success",
          description: `Created ${data.flashcardsCount} flashcards! You can find them in your flashcard decks.`,
        });
        navigate(`/flashcards/${data.deckId}`);
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error generating flashcards",
        description: error instanceof Error ? error.message : "Failed to generate flashcards. Please try again.",
      });
    }
  });

  const generateFlashcards = async (note: Note) => {
    generateFlashcardsMutation.mutate(note);
  };

  const deleteNotesForSubjectMutation = useMutation({
    mutationFn: async (subject: string) => {
      if (!isOnline) {
        throw new Error("You're offline. Please connect to the internet to delete notes.");
      }
      
      return await deleteNotesForSubject(subject);
    },
    onSuccess: (subject) => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
      toast({
        title: "Success",
        description: `Deleted all notes for subject: ${subject}`,
      });
    },
    onError: (error) => {
      console.error("Error deleting notes:", error);
      toast({
        variant: "destructive",
        title: "Error deleting notes",
        description: error instanceof Error ? error.message : "Failed to delete notes. Please try again.",
      });
    }
  });

  return {
    notes: notes || [],
    loading,
    generatingFlashcardsForNote,
    isOnline,
    fetchNotes: () => refetch(),
    createNote,
    generateFlashcards,
    deleteNotesForSubject: (subject: string) => deleteNotesForSubjectMutation.mutate(subject),
  };
};
