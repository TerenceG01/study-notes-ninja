
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { QuizCompletionCard } from "./QuizCompletionCard";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { QuizNavigation } from "./quiz/QuizNavigation";
import { DifficultyToggle } from "./quiz/DifficultyToggle";
import { useQuizState } from "@/hooks/useQuizState";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface MultipleChoiceModeProps {
  flashcards: any[];
  deckId: string;
}

export const MultipleChoiceMode = ({ flashcards, deckId }: MultipleChoiceModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;

  const {
    correctAnswers,
    totalAttempted,
    selectedOption,
    isAnswered,
    handleOptionSelect,
    resetQuiz,
    setIsAnswered,
    setSelectedOption,
  } = useQuizState(flashcards, currentCard?.id);

  const { data: options, isLoading: isOptionsLoading } = useQuery({
    queryKey: ['multiple-choice-options', currentCard?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('multiple_choice_options')
        .select('*')
        .eq('flashcard_id', currentCard.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentCard?.id,
  });

  const generateOptionsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke('generate-multiple-choice', {
        body: { 
          flashcardId: currentCard.id
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multiple-choice-options', currentCard.id] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error generating options",
        description: error.message,
      });
    },
  });

  // Handle fullscreen toggling
  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen().catch(e => {
        console.error("Error exiting fullscreen:", e);
      });
    } else {
      document.documentElement.requestFullscreen().catch(e => {
        console.error("Error entering fullscreen:", e);
      });
    }
    setIsFullscreen(!isFullscreen);
  };

  const navigateCards = (direction: 'prev' | 'next') => {
    setIsAnswered(false);
    setSelectedOption(null);
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentCard || !options) {
    return (
      <div className="text-center py-8">
        <p className="text-sm sm:text-base font-medium">No flashcards available</p>
      </div>
    );
  }

  if (isOptionsLoading || generateOptionsMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mb-3 sm:mb-4" />
        <p className="text-xs sm:text-sm text-muted-foreground">Loading multiple choice options...</p>
      </div>
    );
  }

  const modalContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="h-8 w-8"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <Card className="w-full flex-shrink-0 max-w-full">
        <CardContent className={isMobile ? "p-3 overflow-hidden" : "p-4 sm:p-6 overflow-hidden"}>
          <h3 className={`${isMobile ? 'text-sm' : 'text-base sm:text-lg'} font-medium mb-3 sm:mb-4 break-words`}>
            {currentCard.question}
          </h3>
          <MultipleChoiceOptions
            options={options}
            isAnswered={isAnswered}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
          />
        </CardContent>
      </Card>

      {isLastCard && isAnswered && (
        <QuizCompletionCard
          correctAnswers={correctAnswers}
          totalAttempted={totalAttempted}
          onRestart={() => {
            resetQuiz();
            setCurrentIndex(0);
          }}
        />
      )}

      <QuizNavigation
        currentIndex={currentIndex}
        totalCards={flashcards.length}
        onNavigate={navigateCards}
      />

      <div className="text-center mt-2 sm:mt-4 text-xs text-muted-foreground">
        {isMobile ? "Tap to answer" : "Click to answer • Arrow keys to navigate • F for fullscreen"}
      </div>
    </>
  );

  return (
    <div className={isMobile ? "w-full max-w-full mx-auto" : "w-[800px] max-w-full mx-auto"}>
      <DifficultyToggle
        currentIndex={currentIndex}
        totalCards={flashcards.length}
      />
      
      <div className="w-full min-w-full max-w-full flex items-center justify-center mt-8">
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Maximize2 className="h-4 w-4" />
          Open Multiple Choice Card
        </Button>
      </div>

      {isMobile ? (
        <Drawer open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
          <DrawerContent className="max-h-[92vh] p-4 pb-6 flex flex-col">
            {modalContent}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-6">
            {modalContent}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
