import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Note {
  id: string;
  created_at: string;
  title: string;
  content: string;
  summary: string | null;
  tags: string[] | null;
  user_id: string;
  subject: string | null;
  subject_color: string | null;
  subject_order: number | null;
  folder: string | null;
}

export function useNotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingFlashcardsForNote, setGeneratingFlashcardsForNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState<{
    title: string;
    content: string;
    subject: string | null;
    subject_color: string | null;
  }>({
    title: "",
    content: "",
    subject: null,
    subject_color: null
  });

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) {
        throw new Error(error.message);
      }
      setNotes(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createNote = async (note: {
    title: string;
    content: string;
    subject: string | null;
    subject_color: string | null;
  }, userId: string) => {
    try {
      const { data, error } = await supabase.from("notes").insert([{
        ...note,
        user_id: userId,
        folder: 'My Notes'
      }]);
      if (error) throw new Error(error.message);
      fetchNotes();
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
      return false;
    }
  };

  const generateFlashcards = async (noteId: string) => {
    try {
      setGeneratingFlashcardsForNote(noteId);

      // Get the note details first
      const {
        data: note
      } = await supabase.from('notes').select('*').eq('id', noteId).single();
      if (!note) throw new Error('Note not found');

      // Create flashcard deck with note's subject
      const {
        data: deck
      } = await supabase.from('flashcard_decks').insert([{
        title: note.title,
        description: note.content.substring(0, 100) + '...',
        user_id: user?.id,
        subject: note.subject
      }]).select().single();
      if (!deck) throw new Error('Failed to create flashcard deck');

      // Call the edge function to generate flashcards
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-flashcards', {
        body: {
          noteId,
          deckId: deck.id
        }
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Flashcards generated successfully!"
      });
      return true;
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate flashcards. Please try again."
      });
      return false;
    } finally {
      setGeneratingFlashcardsForNote(null);
    }
  };

  return {
    notes,
    loading,
    generatingFlashcardsForNote,
    fetchNotes,
    createNote,
    generateFlashcards,
    newNote,
    setNewNote
  };
}
