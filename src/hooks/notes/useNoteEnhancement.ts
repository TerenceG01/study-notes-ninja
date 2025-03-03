
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/toast";
import { SummaryLevel } from "./types";

export const useNoteEnhancement = (isOnline: boolean) => {
  const generateSummary = async (content: string, level: SummaryLevel): Promise<string> => {
    try {
      if (!isOnline) {
        toast({
          variant: "destructive",
          title: "You're offline",
          description: "Please connect to the internet to generate summaries.",
        });
        return "Offline - Summary cannot be generated";
      }
      
      const { data, error } = await supabase.functions.invoke('summarize-note', {
        body: {
          content,
          level,
        },
      });

      if (error) throw error;

      if (data?.summary) {
        return data.summary;
      }
      return "Unable to generate summary at this time.";
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        variant: "destructive",
        title: "Error generating summary",
        description: "Failed to generate summary. Please try again.",
      });
      return "Error generating summary. Please try again.";
    }
  };

  const enhanceNote = async (content: string, enhanceType: 'grammar' | 'structure'): Promise<string> => {
    try {
      if (!isOnline) {
        toast({
          variant: "destructive",
          title: "You're offline",
          description: "Please connect to the internet to enhance notes.",
        });
        return content;
      }
      
      const { data, error } = await supabase.functions.invoke('enhance-note', {
        body: {
          content,
          enhanceType,
        },
      });

      if (error) throw error;

      if (data?.enhanced) {
        return data.enhanced;
      }
      return content;
    } catch (error) {
      console.error("Error enhancing note:", error);
      toast({
        variant: "destructive",
        title: "Error enhancing note",
        description: "Failed to enhance note. Please try again.",
      });
      return content;
    }
  };

  const generateFlashcards = async (note: {id: string, content: string, title: string}, onSuccess?: (deckId: string) => void) => {
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "You're offline",
        description: "Please connect to the internet to generate flashcards.",
      });
      return;
    }
    
    try {
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
        if (onSuccess && data.deckId) {
          onSuccess(data.deckId);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating flashcards",
        description: "Failed to generate flashcards. Please try again.",
      });
    }
  };

  return {
    generateSummary,
    enhanceNote,
    generateFlashcards
  };
};
