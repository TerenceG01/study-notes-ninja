
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFlashcardStudy = (flashcards: any[], deckId: string) => {
  const [mode, setMode] = useState<'standard' | 'multiple-choice'>('standard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(flashcards);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const currentCard = cards[currentIndex];

  const updateFlashcardMutation = useMutation({
    mutationFn: async ({
      id,
      learned
    }: {
      id: string;
      learned: boolean;
    }) => {
      // Update flashcard learned status
      const {
        error: flashcardError
      } = await supabase.from('flashcards').update({
        learned
      }).eq('id', id);
      if (flashcardError) throw flashcardError;

      // Add review record
      const {
        error: reviewError
      } = await supabase.from('flashcard_reviews').insert({
        flashcard_id: id,
        is_correct: learned
      });
      if (reviewError) throw reviewError;
    },
    onSuccess: (_, {
      id,
      learned
    }) => {
      queryClient.invalidateQueries({
        queryKey: ['flashcards', deckId]
      });
      queryClient.invalidateQueries({
        queryKey: ['flashcard-reviews', deckId]
      });
      queryClient.invalidateQueries({
        queryKey: ['flashcard-deck', deckId]
      });

      // Update local state
      setCards(prevCards => prevCards.map(card => card.id === id ? {
        ...card,
        learned
      } : card));
      toast({
        title: learned ? "Card marked as learned" : "Card marked for practice",
        description: "Your progress has been saved."
      });
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Error updating flashcard",
        description: error.message
      });
    }
  });

  const navigateCards = useCallback((direction: 'prev' | 'next') => {
    setIsFlipped(false);
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, cards.length]);

  const shuffleCards = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  return {
    mode,
    setMode,
    currentIndex,
    setCurrentIndex,
    isFlipped,
    setIsFlipped,
    cards,
    setCards,
    currentCard,
    updateFlashcardMutation,
    navigateCards,
    shuffleCards
  };
};
