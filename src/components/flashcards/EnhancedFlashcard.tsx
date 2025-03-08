
import { Card, CardContent } from "@/components/ui/card";
import { useSwipeDetection } from "@/hooks/useSwipeDetection";

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
  const swipeHandlers = useSwipeDetection(
    () => onNext(),       // Swipe left to go to next card
    () => onPrev(),       // Swipe right to go to previous card
    () => onFlip(!isFlipped) // Swipe up to flip card
  );
  
  return (
    <Card 
      className="w-full h-[300px] cursor-pointer transition-all hover:shadow-lg relative"
      onClick={() => onFlip(!isFlipped)}
      {...swipeHandlers}
    >
      <CardContent className="flex items-center justify-center p-8 h-full overflow-auto">
        <div className="text-xl font-medium text-center max-w-full max-h-full">
          {isFlipped ? card.answer : card.question}
        </div>
      </CardContent>
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        <span className="mr-1">•</span>
        <span>Swipe to navigate</span>
      </div>
    </Card>
  );
};
