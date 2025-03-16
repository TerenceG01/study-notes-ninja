
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSwipeDetection } from "@/hooks/useSwipeDetection";
import { useIsMobile } from "@/hooks/use-mobile";

interface FlashcardProps {
  card: {
    id: string;
    question: string;
    answer: string;
    learned: boolean;
  };
  isFlipped: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
  totalCards: number;
  currentIndex: number;
  updateFlashcard: (data: { id: string; learned: boolean }) => void;
}

export const Flashcard = ({
  card,
  isFlipped,
  onFlip,
  onPrev,
  onNext,
  totalCards,
  currentIndex,
  updateFlashcard
}: FlashcardProps) => {
  const isMobile = useIsMobile();
  const swipeHandlers = useSwipeDetection(
    () => onNext(),       // Swipe left to go to next card
    () => onPrev(),       // Swipe right to go to previous card
    () => onFlip()        // Swipe up to flip card
  );

  if (!card) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium text-muted-foreground">No flashcard available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <Card 
        className="w-full h-[300px] sm:h-[400px] cursor-pointer transition-all hover:shadow-lg relative flex items-center justify-center overflow-hidden"
        onClick={onFlip}
        {...(isMobile ? swipeHandlers : {})}
      >
        <CardContent className="flex items-center justify-center p-3 sm:p-6 h-full w-full overflow-auto">
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-center w-full break-words px-2">
            {isFlipped ? card.answer : card.question}
          </div>
        </CardContent>
        
        {/* Navigation indicators for mobile */}
        {isMobile && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 p-1 rounded-full"
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 p-1 rounded-full"
              disabled={currentIndex === totalCards - 1}
            >
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </>
        )}
        
        <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
          <span>{isMobile ? "Tap to flip" : "Space to flip"}</span>
        </div>
      </Card>

      {/* Card navigation buttons */}
      <div className="flex justify-between items-center w-full">
        <Button 
          variant="outline" 
          onClick={onPrev} 
          disabled={currentIndex === 0}
          size={isMobile ? "sm" : "default"}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {isMobile ? "Prev" : "Previous"}
        </Button>
        <Button 
          variant="outline" 
          onClick={onNext} 
          disabled={currentIndex === totalCards - 1}
          size={isMobile ? "sm" : "default"}
          className="w-full sm:w-auto"
        >
          {isMobile ? "Next" : "Next"}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="text-center mt-2">
        <span className="text-xs text-muted-foreground">
          Card {currentIndex + 1} of {totalCards}
        </span>
      </div>
    </div>
  );
};
