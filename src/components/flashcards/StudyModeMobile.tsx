
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedFlashcard } from "@/components/flashcards/EnhancedFlashcard";
import { Shuffle, ArrowLeft, ArrowRight, Brain, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MultipleChoiceMode } from "@/components/flashcards/MultipleChoiceMode";

interface StudyModeMobileProps {
  flashcards: any[];
  deckId: string;
}

export const StudyModeMobile = ({
  flashcards,
  deckId
}: StudyModeMobileProps) => {
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
      const { error: flashcardError } = await supabase.from('flashcards').update({
        learned
      }).eq('id', id);
      if (flashcardError) throw flashcardError;

      // Add review record
      const { error: reviewError } = await supabase.from('flashcard_reviews').insert({
        flashcard_id: id,
        is_correct: learned
      });
      if (reviewError) throw reviewError;
    },
    onSuccess: (_, { id, learned }) => {
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

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!currentCard) {
    return <div className="text-center py-8">
      <p className="text-lg font-medium mb-4">No flashcards available</p>
    </div>;
  }

  return (
    <div className="px-2">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </div>
        <Button variant="outline" size="sm" onClick={shuffleCards} className="px-2">
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={mode === 'standard' ? 'default' : 'outline'} 
            onClick={() => setMode('standard')}
            size="sm"
            className="px-2"
          >
            <Brain className="h-4 w-4 mr-1" />
            Standard
          </Button>
          <Button 
            variant={mode === 'multiple-choice' ? 'default' : 'outline'} 
            onClick={() => setMode('multiple-choice')}
            size="sm"
            className="px-2"
          >
            <Check className="h-4 w-4 mr-1" />
            Multiple Choice
          </Button>
        </div>
      </div>

      {mode === 'standard' ? (
        <>
          <EnhancedFlashcard 
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={setIsFlipped}
            onNext={() => navigateCards('next')}
            onPrev={() => navigateCards('prev')}
          />

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigateCards('prev')} 
              disabled={currentIndex === 0}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <Button 
              variant="outline" 
              onClick={() => navigateCards('next')} 
              disabled={currentIndex === cards.length - 1}
              size="sm"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="text-center mt-4 text-xs text-muted-foreground">
            Swipe left/right to navigate • Swipe up to flip
          </div>
        </>
      ) : (
        <MultipleChoiceMode flashcards={cards} deckId={deckId} />
      )}
    </div>
  );
};
