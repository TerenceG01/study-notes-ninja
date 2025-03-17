
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
      className="w-full max-w-[100%] h-[350px] sm:h-[450px] md:h-[500px] cursor-pointer transition-all hover:shadow-lg relative flex-shrink-0 overflow-hidden"
      onClick={() => onFlip(!isFlipped)}
      {...swipeHandlers}
    >
      <div className="absolute inset-0 w-full h-full">
        <div className={`w-full h-full transition-all duration-300 ${isFlipped ? 'opacity-0 absolute' : 'opacity-100'}`}>
          <CardContent className="flex items-center justify-center p-4 sm:p-8 h-full overflow-auto">
            <div className="text-lg sm:text-xl md:text-2xl font-medium text-center w-full break-words text-primary">
              {card.question}
            </div>
          </CardContent>
        </div>
        
        <div className={`w-full h-full transition-all duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 absolute'}`}>
          <CardContent className="flex items-center justify-center p-4 sm:p-8 h-full overflow-auto">
            <div className="text-lg sm:text-xl md:text-2xl font-medium text-center w-full break-words text-primary">
              {card.answer}
            </div>
          </CardContent>
        </div>
      </div>
      
      {/* Navigation arrows */}
      {isMobile && (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full z-10"
            disabled={false}
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full z-10"
            disabled={false}
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </>
      )}
      
      {/* Expand button */}
      {onExpand && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 p-1 h-9 w-9 bg-background/80 rounded-full z-10"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <Maximize2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      )}
      
      <div className="absolute bottom-2 right-3 text-xs text-muted-foreground z-10">
        <span>{isMobile ? "Tap to flip" : "Space to flip"}</span>
      </div>
    </Card>
  );
};
