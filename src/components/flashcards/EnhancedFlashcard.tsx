
import { Card, CardContent } from "@/components/ui/card";
import { useSwipeDetection } from "@/hooks/useSwipeDetection";
import { useIsMobile } from "@/hooks/use-mobile";

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
      className="w-full max-w-full h-[250px] sm:h-[350px] cursor-pointer transition-all hover:shadow-lg relative flex-shrink-0"
      onClick={() => onFlip(!isFlipped)}
      {...swipeHandlers}
    >
      <CardContent className="flex items-center justify-center p-4 sm:p-6 md:p-8 h-full overflow-auto">
        <div className="text-lg sm:text-xl md:text-2xl font-medium text-center w-full break-words">
          {isFlipped ? card.answer : card.question}
        </div>
      </CardContent>
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        <span className="mr-1">•</span>
        <span>{isMobile ? "Tap to flip" : "Swipe or use arrow keys"}</span>
      </div>
    </Card>
  );
};
