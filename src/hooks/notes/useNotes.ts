
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNetworkStatus } from "./useNetworkStatus";
import { useOfflineNotes } from "./useOfflineNotes";
import { useFlashcardGeneration } from "./useFlashcardGeneration";
import { Note, NewNote } from "./types";

export const useNotes = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOnline } = useNetworkStatus();
  const { saveOfflineNote, getOfflineNotes, clearOfflineNotes } = useOfflineNotes();
  const { generatingFlashcardsForNote, generateFlashcards: generateFlashcardsBase } = useFlashcardGeneration();

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
      if (!isOnline) {
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

  // Function to sync pending changes when back online
  const syncPendingChanges = async () => {
    if (!isOnline) return;

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
          setNotes(prevNotes => [offlineNote, ...prevNotes]);
          
          toast({
            title: "Saved offline",
            description: "Your note has been saved locally and will sync when you're back online.",
          });
          return true;
        }
        return false;
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

  const generateFlashcards = (note: Note) => {
    return generateFlashcardsBase(note, isOnline);
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
    syncPendingChanges,
    createNote,
    generateFlashcards,
    deleteNotesForSubject,
  };
};
