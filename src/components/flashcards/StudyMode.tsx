import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, ArrowLeft, ArrowRight, Brain, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MultipleChoiceMode } from "@/components/flashcards/MultipleChoiceMode";

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

  const currentCard = cards[currentIndex];

  const updateFlashcardMutation = useMutation({
    mutationFn: async ({ id, learned }: { id: string; learned: boolean }) => {
      // Update flashcard learned status
      const { error: flashcardError } = await supabase
        .from('flashcards')
        .update({ learned })
        .eq('id', id);

      if (flashcardError) throw flashcardError;

      // Add review record
      const { error: reviewError } = await supabase
        .from('flashcard_reviews')
        .insert({
          flashcard_id: id,
          is_correct: learned,
        });

      if (reviewError) throw reviewError;
    },
    onSuccess: (_, { id, learned }) => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', deckId] });
      queryClient.invalidateQueries({ queryKey: ['flashcard-reviews', deckId] });
      queryClient.invalidateQueries({ queryKey: ['flashcard-deck', deckId] });
      
      // Update local state
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === id ? { ...card, learned } : card
        )
      );

      toast({
        title: learned ? "Card marked as learned" : "Card marked for practice",
        description: "Your progress has been saved.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating flashcard",
        description: error.message,
      });
    },
  });

  const navigateCards = useCallback((direction: 'prev' | 'next') => {
    setIsFlipped(false);
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, cards.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsFlipped(!isFlipped);
      } else if (e.key === 'ArrowLeft') {
        navigateCards('prev');
      } else if (e.key === 'ArrowRight') {
        navigateCards('next');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, navigateCards]);

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!currentCard) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium mb-4">No flashcards available</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button 
            variant={mode === 'standard' ? 'default' : 'outline'}
            onClick={() => setMode('standard')}
          >
            <Brain className="h-4 w-4 mr-2" />
            Standard Mode
          </Button>
          <Button 
            variant={mode === 'multiple-choice' ? 'default' : 'outline'}
            onClick={() => setMode('multiple-choice')}
          >
            <Check className="h-4 w-4 mr-2" />
            Multiple Choice
          </Button>
        </div>
        <Button variant="outline" onClick={shuffleCards}>
          <Shuffle className="h-4 w-4 mr-2" />
          Shuffle
        </Button>
      </div>

      {mode === 'standard' ? (
        <>
          <Card 
            className="min-h-[300px] cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <CardContent className="flex items-center justify-center p-8 min-h-[300px]">
              <div className="text-xl font-medium text-center">
                {isFlipped ? currentCard.answer : currentCard.question}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={() => navigateCards('prev')}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Card
            </Button>

            <Button
              variant="outline"
              onClick={() => navigateCards('next')}
              disabled={currentIndex === cards.length - 1}
            >
              Next Card
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      ) : (
        <MultipleChoiceMode flashcards={cards} deckId={deckId} />
      )}

      {mode === 'standard' && (
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Press Enter to flip • Arrow keys to navigate
        </div>
      )}
    </div>
  );
};
