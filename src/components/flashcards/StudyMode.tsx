import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, ArrowLeft, ArrowRight, Check, X, Brain, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
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
  const [showProgress, setShowProgress] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const currentCard = cards[currentIndex];

  // Fetch review history
  const { data: reviewHistory } = useQuery({
    queryKey: ['flashcard-reviews', deckId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcard_reviews')
        .select(`
          *,
          flashcard:flashcards(question, answer)
        `)
        .order('review_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const resetProgressMutation = useMutation({
    mutationFn: async () => {
      // First update all flashcards in the deck to be not learned
      const { error: flashcardsError } = await supabase
        .from('flashcards')
        .update({ learned: false })
        .eq('deck_id', deckId);

      if (flashcardsError) throw flashcardsError;

      // Update deck stats to reset learned_cards count
      const { error: deckError } = await supabase
        .from('flashcard_decks')
        .update({ learned_cards: 0 })
        .eq('id', deckId);

      if (deckError) throw deckError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', deckId] });
      queryClient.invalidateQueries({ queryKey: ['flashcard-reviews', deckId] });
      queryClient.invalidateQueries({ queryKey: ['flashcard-deck', deckId] });
      toast({
        title: "Progress reset",
        description: "All cards have been marked as not learned.",
      });
      // Update local state
      setCards(cards.map(card => ({ ...card, learned: false })));
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error resetting progress",
        description: error.message,
      });
    },
  });

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

  const learnedCount = cards.filter(card => card.learned).length;

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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowProgress(!showProgress);
              setShowTable(false);
            }}
          >
            <Brain className="h-4 w-4 mr-2" />
            {showProgress ? "Hide Progress" : "Show Progress"}
          </Button>
          <Button variant="outline" onClick={shuffleCards}>
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>
      </div>

      {mode === 'standard' ? (
        <>
          {showProgress ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Progress Tracking</h3>
                  <Button 
                    variant="outline" 
                    onClick={handleResetProgress}
                    className="text-destructive hover:text-destructive"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Progress
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div 
                      className="bg-secondary/50 p-4 rounded-lg cursor-pointer hover:bg-secondary/70 transition-colors"
                      onClick={toggleTableVisibility}
                    >
                      <div className="text-2xl font-bold">{learnedCount}</div>
                      <div className="text-sm text-muted-foreground">Cards Learned</div>
                    </div>
                    <div 
                      className="bg-secondary/50 p-4 rounded-lg cursor-pointer hover:bg-secondary/70 transition-colors"
                      onClick={toggleTableVisibility}
                    >
                      <div className="text-2xl font-bold">{cards.length - learnedCount}</div>
                      <div className="text-sm text-muted-foreground">Need Practice</div>
                    </div>
                  </div>

                  {showTable && (
                    <div className="border rounded-lg" ref={tableRef}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead>Last Review</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reviewHistory?.slice(0, 5).map((review: any) => (
                            <TableRow key={review.id}>
                              <TableCell className="font-medium">{review.flashcard.question}</TableCell>
                              <TableCell>{format(new Date(review.review_date), 'PPp')}</TableCell>
                              <TableCell>
                                {review.is_correct ? (
                                  <span className="text-green-500 flex items-center gap-1">
                                    <Check className="h-4 w-4" /> Learned
                                  </span>
                                ) : (
                                  <span className="text-red-500 flex items-center gap-1">
                                    <X className="h-4 w-4" /> Needs Practice
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
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
          )}
        </>
      ) : (
        <MultipleChoiceMode flashcards={cards} deckId={deckId} />
      )}

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

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Press Enter to flip • Arrow keys to navigate
      </div>
    </div>
  );
};
