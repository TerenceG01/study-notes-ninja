
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize2, Minimize2 } from "lucide-react";
import { MultipleChoiceOptions } from "@/components/flashcards/MultipleChoiceOptions";
import { QuizCompletionDialog } from "@/components/flashcards/quiz/QuizCompletionDialog";
import { QuizNavigation } from "@/components/flashcards/quiz/QuizNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface QuizModalContentProps {
  currentCard: any;
  currentIndex: number;
  totalCards: number;
  isAnswered: boolean;
  selectedOption: string | null;
  correctAnswers: number;
  totalAttempted: number;
  options: any[];
  isLastCard: boolean;
  isFullscreen: boolean;
  onOptionSelect: (optionId: string, isCorrect: boolean) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  toggleFullscreen: () => void;
  resetQuiz: () => void;
}

export const QuizModalContent = ({
  currentCard,
  currentIndex,
  totalCards,
  isAnswered,
  selectedOption,
  correctAnswers,
  totalAttempted,
  options,
  isLastCard,
  isFullscreen,
  onOptionSelect,
  onNavigate,
  toggleFullscreen,
  resetQuiz
}: QuizModalContentProps) => {
  const isMobile = useIsMobile();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  
  // Show completion dialog when the last card is answered
  useEffect(() => {
    if (isLastCard && isAnswered && totalAttempted > 0) {
      setShowCompletionDialog(true);
    }
  }, [isLastCard, isAnswered, totalAttempted]);
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {totalCards}
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

      <Card className="w-full flex-shrink-0 max-w-full h-[320px] sm:h-[380px] flex items-center">
        <CardContent className={`${isMobile ? "p-3" : "p-4 sm:p-6"} h-full w-full flex flex-col`}>
          <h3 className={`${isMobile ? 'text-sm' : 'text-base sm:text-lg'} font-medium mb-3 sm:mb-4 text-center line-clamp-2`}>
            {currentCard.question}
          </h3>
          <div className="flex-grow flex items-start justify-center w-full overflow-hidden">
            <MultipleChoiceOptions
              options={options}
              isAnswered={isAnswered}
              selectedOption={selectedOption}
              onSelect={onOptionSelect}
            />
          </div>
        </CardContent>
      </Card>

      <QuizCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        correctAnswers={correctAnswers}
        totalAttempted={totalAttempted}
        onRestart={() => {
          resetQuiz();
          setShowCompletionDialog(false);
        }}
      />

      <QuizNavigation
        currentIndex={currentIndex}
        totalCards={totalCards}
        onNavigate={onNavigate}
      />

      <div className="text-center mt-2 sm:mt-4 text-xs text-muted-foreground">
        {isMobile ? "Tap to answer" : "Click to answer • Arrow keys to navigate • F for fullscreen"}
      </div>
    </>
  );
};
