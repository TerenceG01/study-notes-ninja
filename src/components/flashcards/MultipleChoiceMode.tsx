
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuizState } from "@/hooks/useQuizState";
import { useMultipleChoiceOptions } from "@/hooks/useMultipleChoiceOptions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { DifficultyToggle } from "./quiz/DifficultyToggle";
import { QuizCardPreview } from "./quiz/QuizCardPreview";
import { QuizModalContent } from "./quiz/QuizModalContent";

interface MultipleChoiceModeProps {
  flashcards: any[];
  deckId: string;
}

export const MultipleChoiceMode = ({ flashcards, deckId }: MultipleChoiceModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
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

  const { options, isOptionsLoading, generateOptionsMutation } = useMultipleChoiceOptions(currentCard?.id);

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
    <QuizModalContent
      currentCard={currentCard}
      currentIndex={currentIndex}
      totalCards={flashcards.length}
      isAnswered={isAnswered}
      selectedOption={selectedOption}
      correctAnswers={correctAnswers}
      totalAttempted={totalAttempted}
      options={options}
      isLastCard={isLastCard}
      isFullscreen={isFullscreen}
      onOptionSelect={handleOptionSelect}
      onNavigate={navigateCards}
      toggleFullscreen={toggleFullscreen}
      resetQuiz={() => {
        resetQuiz();
        setCurrentIndex(0);
      }}
    />
  );

  return (
    <div className={isMobile ? "w-full max-w-full mx-auto" : "w-full max-w-2xl mx-auto"}>
      <DifficultyToggle
        currentIndex={currentIndex}
        totalCards={flashcards.length}
      />
      
      <QuizCardPreview
        currentCard={currentCard}
        currentIndex={currentIndex}
        totalCards={flashcards.length}
        onOpenModal={() => setIsModalOpen(true)}
        onNavigate={navigateCards}
      />

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
