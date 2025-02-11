
import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, ArrowLeft, ArrowRight, Check, X, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', deckId] });
      queryClient.invalidateQueries({ queryKey: ['flashcard-reviews', deckId] });
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

  const markCard = (learned: boolean) => {
    updateFlashcardMutation.mutate({ 
      id: currentCard.id, 
      learned 
    });
    toast({
      title: learned ? "Card marked as learned" : "Card marked for practice",
      description: "Your progress has been saved.",
    });
    if (currentIndex < cards.length - 1) {
      navigateCards('next');
    }
  };

  const toggleTableVisibility = () => {
    setShowTable(!showTable);
    if (!showTable) {
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
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
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
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

      {showProgress ? (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Progress Tracking</h3>
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
        </>
      )}
    </div>
  );
};
