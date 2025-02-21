
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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

  const fetchNotes = async () => {
    try {
      console.log("Fetching notes..."); // Debug log
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Fetched notes:", data); // Debug log
      setNotes(data || []);
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

  useEffect(() => {
    fetchNotes();
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
      await fetchNotes(); // Immediately fetch updated notes

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

  const generateFlashcards = async (note: Note) => {
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

  return {
    notes,
    loading,
    generatingFlashcardsForNote,
    fetchNotes,
    createNote,
    generateFlashcards,
  };
};
