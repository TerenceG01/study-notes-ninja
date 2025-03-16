
import { Button } from "@/components/ui/button";
import { Brain, Maximize2, RefreshCw, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useState } from "react";
import { FlashcardModal } from "@/components/flashcards/FlashcardModal";
import { Card, CardContent } from "@/components/ui/card";

interface StandardModeViewProps {
  currentCard: any;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  navigateCards: (direction: 'prev' | 'next') => void;
  currentIndex: number;
  cardsLength: number;
  isMobile: boolean;
  swipeHandlers?: any;
  shuffleCards?: () => void;
}

export const StandardModeView = ({
  currentCard,
  isFlipped,
  setIsFlipped,
  navigateCards,
  currentIndex,
  cardsLength,
  isMobile,
  swipeHandlers = {},
  shuffleCards
}: StandardModeViewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col items-center w-full min-w-full max-w-full overflow-hidden">
      <div className="w-full max-w-2xl mx-auto mt-4 grid gap-4">
        {/* Card Preview */}
        <Card className="w-full shadow-sm border hover:shadow-md transition-all cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
              <span>Preview</span>
              <span>Card {currentIndex + 1} of {cardsLength}</span>
            </div>
            <div className="min-h-[150px] flex items-center justify-center">
              <p className="text-lg font-medium text-center">
                {currentCard.question.length > 100 
                  ? currentCard.question.substring(0, 100) + "..." 
                  : currentCard.question}
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}>
                <Maximize2 className="h-4 w-4 mr-1" />
                Expand
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => navigateCards('prev')} 
              disabled={currentIndex === 0}
              className="flex-1 sm:flex-none"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigateCards('next')} 
              disabled={currentIndex === cardsLength - 1}
              className="flex-1 sm:flex-none"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Flip Card
            </Button>
            <Button 
              variant="default" 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Study
            </Button>
          </div>
        </div>

        {shuffleCards && (
          <div className="w-full flex justify-center mt-2">
            <Button variant="outline" onClick={shuffleCards} className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-1" />
              Shuffle Cards
            </Button>
          </div>
        )}
        
        <div className="text-center mt-2 text-xs text-muted-foreground">
          <p>Tip: Use arrow keys to navigate between cards, spacebar to flip</p>
        </div>
      </div>
      
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
