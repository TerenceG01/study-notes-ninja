
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useProfileStats(userId: string | undefined, isOpen: boolean) {
  const [statsLoading, setStatsLoading] = useState(false);
  const [notesCount, setNotesCount] = useState(0);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId || !isOpen) return;
    
    const fetchUserStats = async () => {
      setStatsLoading(true);
      try {
        // Get notes count
        const { count: notesCount, error: notesError } = await supabase
          .from("notes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        
        if (notesError) throw notesError;
        
        // Get flashcards count
        const userDecks = await supabase
          .from("flashcard_decks")
          .select("id")
          .eq("user_id", userId);
          
        if (userDecks.error) throw userDecks.error;
        
        // If user has decks, get the count of flashcards in those decks
        let flashcardsTotal = 0;
        if (userDecks.data && userDecks.data.length > 0) {
          const deckIds = userDecks.data.map(deck => deck.id);
          
          const { count, error: flashcardsError } = await supabase
            .from("flashcards")
            .select("*", { count: "exact", head: true })
            .in("deck_id", deckIds);
            
          if (flashcardsError) throw flashcardsError;
          flashcardsTotal = count || 0;
        }
        
        // Set the values
        setNotesCount(notesCount || 0);
        setFlashcardsCount(flashcardsTotal);
        
        // For demo purposes, set a random streak between 1-14
        setStudyStreak(Math.floor(Math.random() * 14) + 1);
        
      } catch (error) {
        console.error("Error fetching user stats:", error);
        toast({
          variant: "destructive",
          title: "Error fetching stats",
          description: error instanceof Error ? error.message : "An error occurred"
        });
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchUserStats();
  }, [userId, isOpen, toast]);

  return {
    statsLoading,
    notesCount,
    flashcardsCount,
    studyStreak
  };
}
