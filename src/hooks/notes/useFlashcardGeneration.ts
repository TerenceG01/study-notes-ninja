
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Note } from "./types";

export const useFlashcardGeneration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [generatingFlashcardsForNote, setGeneratingFlashcardsForNote] = useState<string | null>(null);

  const generateFlashcards = async (note: Note, isOnline: boolean) => {
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

  return {
    generatingFlashcardsForNote,
    generateFlashcards
  };
};
