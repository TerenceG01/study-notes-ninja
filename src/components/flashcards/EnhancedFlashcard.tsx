
import { Card, CardContent } from "@/components/ui/card";
import { useSwipeDetection } from "@/hooks/useSwipeDetection";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onExpand?: () => void;
}

export const EnhancedFlashcard = ({ 
  card, 
  isFlipped, 
  onFlip, 
  onNext, 
  onPrev,
  onExpand
}: EnhancedFlashcardProps) => {
  const isMobile = useIsMobile();
  const swipeHandlers = useSwipeDetection(
    () => onNext(),       // Swipe left to go to next card
    () => onPrev(),       // Swipe right to go to previous card
    () => onFlip(!isFlipped) // Swipe up to flip card
  );
  
  return (
    <Card 
      className="w-full max-w-[100%] h-[200px] sm:h-[300px] cursor-pointer transition-all hover:shadow-lg relative flex-shrink-0 overflow-hidden"
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
      
      {/* Expand button */}
      {onExpand && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1 p-1 h-8 w-8 bg-background/80 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}
      
      <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
        <span>{isMobile ? "Tap to flip" : "Space to flip"}</span>
      </div>
    </Card>
  );
};
