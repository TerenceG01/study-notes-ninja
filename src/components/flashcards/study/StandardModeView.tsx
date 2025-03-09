
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EnhancedFlashcard } from "@/components/flashcards/EnhancedFlashcard";

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
  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {!isMobile && (
        <div className="text-sm text-muted-foreground mb-2 w-full px-2">
          Card {currentIndex + 1} of {cardsLength}
        </div>
      )}
      
      <div className="w-full mx-auto flex-shrink-0 px-2 sm:px-0 overflow-hidden">
        <EnhancedFlashcard 
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={setIsFlipped}
          onNext={() => navigateCards('next')}
          onPrev={() => navigateCards('prev')}
          {...(isMobile ? swipeHandlers : {})}
        />
      </div>

      <div className={`${isMobile ? 'mt-4 grid grid-cols-2 gap-2' : 'flex justify-between items-center mt-6'} w-full mx-auto px-2`}>
        <Button 
          variant="outline" 
          onClick={() => navigateCards('prev')} 
          disabled={currentIndex === 0}
          size={isMobile ? "sm" : "default"}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {isMobile ? "Previous" : "Previous Card"}
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigateCards('next')} 
          disabled={currentIndex === cardsLength - 1}
          size={isMobile ? "sm" : "default"}
          className="w-full sm:w-auto"
        >
          {isMobile ? "Next" : "Next Card"}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="text-center mt-4 text-xs sm:text-sm text-muted-foreground w-full mx-auto px-2 break-words">
        {isMobile ? 
          "Swipe or use arrow keys • Tap to flip" : 
          "Press Space/Enter to flip • Arrow keys to navigate • Ctrl+F to flip"}
      </div>
    </div>
  );
};
