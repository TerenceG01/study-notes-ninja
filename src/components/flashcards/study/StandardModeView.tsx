
import { Button } from "@/components/ui/button";
import { 
  Maximize2, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Info
} from "lucide-react";
import { useState } from "react";
import { FlashcardModal } from "@/components/flashcards/FlashcardModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

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
  const progress = Math.round(((currentIndex + 1) / cardsLength) * 100);
  
  return (
    <div className="flex flex-col items-center w-full min-w-full max-w-full overflow-hidden">
      {/* Progress indicator */}
      <div className="w-full max-w-2xl mx-auto mb-3">
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1.5">
          <span>Progress</span>
          <span>{currentIndex + 1} of {cardsLength}</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      
      <div className="w-full max-w-2xl mx-auto mt-2 grid gap-4">
        {/* Card Preview */}
        <Card className="w-full shadow-sm border hover:shadow-md transition-all cursor-pointer group" onClick={() => setIsModalOpen(true)}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3">
              <Badge variant="outline" className="bg-primary/5 text-xs">
                {isFlipped ? "Answer" : "Question"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Card {currentIndex + 1} of {cardsLength}
              </Badge>
            </div>
            <div className="min-h-[180px] flex items-center justify-center">
              <p className="text-lg font-medium text-center">
                {currentCard.question.length > 120 
                  ? currentCard.question.substring(0, 120) + "..." 
                  : currentCard.question}
              </p>
            </div>
            <div className="flex justify-end pt-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}>
                      <Maximize2 className="h-4 w-4 mr-1" />
                      Study Card
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open full card view</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          <div className="flex gap-2 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={() => navigateCards('prev')} 
                    disabled={currentIndex === 0}
                    className="flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous card (←)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={() => navigateCards('next')} 
                    disabled={currentIndex === cardsLength - 1}
                    className="flex-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next card (→)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {shuffleCards && (
          <div className="w-full flex justify-center mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={shuffleCards} className="w-full sm:w-auto">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Shuffle Cards
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Randomize card order</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          <Info className="h-3 w-3 mr-1.5" />
          <p>Use arrow keys to navigate, spacebar to flip</p>
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
