
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import { useState } from "react";
import { FlashcardModal } from "@/components/flashcards/FlashcardModal";

interface StandardModeViewProps {
  currentCard: any;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  navigateCards: (direction: 'prev' | 'next') => void;
  currentIndex: number;
  cardsLength: number;
  isMobile: boolean;
  swipeHandlers?: any;
}

export const StandardModeView = ({
  currentCard,
  isFlipped,
  setIsFlipped,
  navigateCards,
  currentIndex,
  cardsLength,
  isMobile,
  swipeHandlers = {}
}: StandardModeViewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col items-center w-full min-w-full max-w-full overflow-hidden">
      {!isModalOpen && (
        <div className="w-full min-w-full max-w-full flex items-center justify-center mt-8">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            Open Flashcard
          </Button>
        </div>
      )}
      
      <FlashcardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentCard={currentCard}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        navigateCards={navigateCards}
        currentIndex={currentIndex}
        cardsLength={cardsLength}
      />
    </div>
  );
};
