
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, ArrowLeft, ArrowRight, Brain, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MultipleChoiceMode } from "@/components/flashcards/MultipleChoiceMode";
import { EnhancedFlashcard } from "@/components/flashcards/EnhancedFlashcard";
import { useSwipeDetection } from "@/hooks/useSwipeDetection";
import { useIsMobile } from "@/hooks/use-mobile";

interface StudyModeProps {
  flashcards: any[];
  deckId: string;
}

export const StudyMode = ({ flashcards, deckId }: StudyModeProps) => {
  const [mode, setMode] = useState<'standard' | 'multiple-choice'>('standard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(flashcards);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
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

  const swipeHandlers = useSwipeDetection(
    () => navigateCards('next'),       // Swipe left to go to next card
    () => navigateCards('prev'),       // Swipe right to go to previous card
    () => setIsFlipped(!isFlipped)     // Swipe up to flip card
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip keyboard shortcuts on mobile to avoid conflicts with virtual keyboard
      if (isMobile) return;
      
      // Add global keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            navigateCards('prev');
            break;
          case 'ArrowRight':
            e.preventDefault();
            navigateCards('next');
            break;
          case 'f':
            e.preventDefault();
            setIsFlipped(!isFlipped);
            break;
        }
      } else {
        // Simple keyboard navigation
        switch (e.key) {
          case 'ArrowLeft':
            navigateCards('prev');
            break;
          case 'ArrowRight':
            navigateCards('next');
            break;
          case ' ': // Spacebar
            e.preventDefault();
            setIsFlipped(!isFlipped);
            break;
          case 'Enter':
            setIsFlipped(!isFlipped);
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, navigateCards, isMobile]);

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

  return <div className={`max-w-3xl mx-auto ${isMobile ? 'px-2' : 'px-4'}`}>
      <div className={`${isMobile ? 'flex justify-between items-center mb-4' : 'flex justify-between items-center mb-6'}`}>
        {isMobile ? (
          <>
            <div className="text-sm text-muted-foreground">
              Card {currentIndex + 1} of {cards.length}
            </div>
            <Button variant="outline" size="sm" onClick={shuffleCards} className="px-2">
              <Shuffle className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <Button variant={mode === 'standard' ? 'default' : 'outline'} onClick={() => setMode('standard')}>
                <Brain className="h-4 w-4 mr-2" />
                Standard Mode
              </Button>
              <Button variant={mode === 'multiple-choice' ? 'default' : 'outline'} onClick={() => setMode('multiple-choice')}>
                <Check className="h-4 w-4 mr-2" />
                Multiple Choice
              </Button>
            </div>
            <Button variant="outline" onClick={shuffleCards}>
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
          </>
        )}
      </div>

      {isMobile && (
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
      )}

      {mode === 'standard' ? (
        <>
          {!isMobile && (
            <div className="text-sm text-muted-foreground mb-2">
              Card {currentIndex + 1} of {cards.length}
            </div>
          )}
          
          <EnhancedFlashcard 
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={setIsFlipped}
            onNext={() => navigateCards('next')}
            onPrev={() => navigateCards('prev')}
            {...(isMobile ? swipeHandlers : {})}
          />

          <div className={`${isMobile ? 'mt-4 grid grid-cols-2 gap-2' : 'flex justify-between items-center mt-6'}`}>
            <Button 
              variant="outline" 
              onClick={() => navigateCards('prev')} 
              disabled={currentIndex === 0}
              size={isMobile ? "sm" : "default"}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {isMobile ? "Previous" : "Previous Card"}
            </Button>

            <Button 
              variant="outline" 
              onClick={() => navigateCards('next')} 
              disabled={currentIndex === cards.length - 1}
              size={isMobile ? "sm" : "default"}
            >
              {isMobile ? "Next" : "Next Card"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="text-center mt-4 text-sm text-muted-foreground">
            {isMobile ? 
              "Swipe or use arrow keys • Tap to flip" : 
              "Press Space/Enter to flip • Arrow keys to navigate • Ctrl+F to flip"}
          </div>
        </>
      ) : (
        <MultipleChoiceMode flashcards={cards} deckId={deckId} />
      )}
    </div>;
};
