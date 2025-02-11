
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface StudyModeProps {
  flashcards: any[];
  deckId: string;
}

export const StudyMode = ({ flashcards, deckId }: StudyModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(flashcards);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentCard = cards[currentIndex];

  const updateFlashcardMutation = useMutation({
    mutationFn: async ({ id, learned }: { id: string; learned: boolean }) => {
      const { error } = await supabase
        .from('flashcards')
        .update({ learned })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', deckId] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating flashcard",
        description: error.message,
      });
    },
  });

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
  }, [isFlipped]);

  const navigateCards = (direction: 'prev' | 'next') => {
    setIsFlipped(false);
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const markCard = (learned: boolean) => {
    updateFlashcardMutation.mutate({ id: currentCard.id, learned });
    if (currentIndex < cards.length - 1) {
      navigateCards('next');
    }
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
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </div>
        <Button variant="outline" onClick={shuffleCards}>
          <Shuffle className="h-4 w-4 mr-2" />
          Shuffle
        </Button>
      </div>

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

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-red-500 hover:text-red-600"
            onClick={() => markCard(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Need Practice
          </Button>
          <Button
            variant="outline"
            className="text-green-500 hover:text-green-600"
            onClick={() => markCard(true)}
          >
            <Check className="h-4 w-4 mr-2" />
            Learned
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => navigateCards('next')}
          disabled={currentIndex === cards.length - 1}
        >
          Next Card
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Press Enter to flip • Arrow keys to navigate
      </div>
    </div>
  );
};
