
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Note, NewNote, SummaryLevel } from "./notes/types";
import { useNotesOperations } from "./notes/useNotesOperations";
import { useOnlineStatus } from "./notes/useOnlineStatus";
import { useNoteEnhancement } from "./notes/useNoteEnhancement";

export type { Note, NewNote, SummaryLevel };

export const useNotes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
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
  } = useNotesOperations(navigator.onLine);
  
  const { isOnline } = useOnlineStatus(syncPendingChanges);
  
  const {
    generateSummary,
    enhanceNote,
    generateFlashcards: generateFlashcardsBase
  } = useNoteEnhancement(isOnline);

  // Wrapper for generateFlashcards to handle UI state
  const generateFlashcards = async (note: Note) => {
    try {
      setGeneratingFlashcardsForNote(note.id);
      await generateFlashcardsBase(note, (deckId) => {
        if (navigate) {
          navigate(`/flashcards/${deckId}`);
        }
      });
    } finally {
      setGeneratingFlashcardsForNote(null);
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

  return {
    notes,
    loading,
    generatingFlashcardsForNote,
    isOnline,
    fetchNotes,
    createNote,
    generateFlashcards,
    deleteNotesForSubject,
    addNote,
    updateNote,
    deleteNote,
    generateSummary,
    enhanceNote,
  };
};
