
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

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

  const fetchNotes = async () => {
    console.log("Fetching notes...");
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    console.log("Fetched notes:", data);
    
    // If we're offline, merge with any offline notes
    if (!navigator.onLine) {
      const offlineNotes = getOfflineNotes();
      return [...offlineNotes, ...(data || [])];
    }
    
    return data || [];
  };

  const { data: notes, isLoading: loading, refetch } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: fetchNotes,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    onSuccess: (data) => {
      // Cache for offline use
      if (data?.length) {
        localStorage.setItem('cachedNotes', JSON.stringify(data));
      }
    },
    meta: {
      errorToast: true
    }
  });

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
      
      console.log("Creating note:", { ...newNote, user_id: userId });
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
      return { success: true };
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
      
      // Update React Query cache to include the new offline note
      queryClient.setQueryData(['notes', user?.id], (oldData: Note[] = []) => [{
        ...note,
        id: `offline_${Date.now()}`,
        created_at: new Date().toISOString(),
        folder: '',
        offline: true
      } as Note, ...oldData]);
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

  const generateFlashcardsMutation = useMutation({
    mutationFn: async (note: Note) => {
      if (!isOnline) {
        throw new Error("You're offline. Please connect to the internet to generate flashcards.");
      }
      
      setGeneratingFlashcardsForNote(note.id);
      try {
        const { data, error } = await supabase.functions.invoke('generate-flashcards', {
          body: {
            noteId: note.id,
            content: note.content,
            title: note.title,
          },
        });

        if (error) throw error;
        return data;
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
      
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("subject", subject);

      if (error) throw error;
      return subject;
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

  const deleteNotesForSubject = async (subject: string) => {
    deleteNotesForSubjectMutation.mutate(subject);
  };

  return {
    notes: notes || [],
    loading,
    generatingFlashcardsForNote,
    isOnline,
    fetchNotes: () => refetch(),
    createNote,
    generateFlashcards,
    deleteNotesForSubject,
  };
};

