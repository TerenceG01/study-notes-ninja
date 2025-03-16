
import { Card, CardContent } from "@/components/ui/card";
import { useSwipeDetection } from "@/hooks/useSwipeDetection";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EnhancedFlashcardProps {
  card: {
    question: string;
    answer: string;
    id: string;
  };
  isFlipped: boolean;
  onFlip: (flipped: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const EnhancedFlashcard = ({ 
  card, 
  isFlipped, 
  onFlip, 
  onNext, 
  onPrev 
}: EnhancedFlashcardProps) => {
  const isMobile = useIsMobile();
  const swipeHandlers = useSwipeDetection(
    () => onNext(),       // Swipe left to go to next card
    () => onPrev(),       // Swipe right to go to previous card
    () => onFlip(!isFlipped) // Swipe up to flip card
  );
  
  return (
    <Card 
      className="w-full min-w-full max-w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] cursor-pointer transition-all hover:shadow-lg relative flex-shrink-0 overflow-hidden"
      onClick={() => onFlip(!isFlipped)}
      {...swipeHandlers}
    >
      <CardContent className="flex items-center justify-center p-3 sm:p-6 h-full overflow-auto">
        <div className="text-base sm:text-lg md:text-xl font-medium text-center w-full break-words text-primary">
          {isFlipped ? card.answer : card.question}
        </div>
      </CardContent>
      
      {/* Navigation arrows */}
      {isMobile && (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 p-1 rounded-full"
            disabled={false}
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 p-1 rounded-full"
            disabled={false}
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </>
      )}
      
      <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
        <span>{isMobile ? "Tap to flip" : "Space to flip"}</span>
      </div>
    </Card>
  );
};
