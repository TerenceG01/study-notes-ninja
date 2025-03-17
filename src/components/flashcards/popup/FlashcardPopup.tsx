
import { DialogWrapper } from "@/components/notes/dialog/DialogWrapper";
import { StandardModeView } from "@/components/flashcards/study/StandardModeView";
import { MultipleChoiceMode } from "@/components/flashcards/MultipleChoiceMode";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

interface FlashcardPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'standard' | 'multiple-choice';
  flashcards: any[];
  deckId: string;
  currentIndex: number;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  navigateCards: (direction: 'prev' | 'next') => void;
  cardsLength: number;
  isMobile: boolean;
  swipeHandlers?: any;
}

export const FlashcardPopup = ({
  open,
  onOpenChange,
  mode,
  flashcards,
  deckId,
  currentIndex,
  isFlipped,
  setIsFlipped,
  navigateCards,
  cardsLength,
  isMobile,
  swipeHandlers = {}
}: FlashcardPopupProps) => {
  const currentCard = flashcards[currentIndex];

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      isFullscreen={false}
    >
      <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1 z-10"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-5 w-5" />
        </Button>
        
        <div className="py-2 px-0 sm:py-2 md:py-2 flex-grow overflow-auto w-full">
          <ResponsiveContainer isPopup={true} withPadding={false} className="w-full max-w-full">
            {mode === 'standard' ? (
              <StandardModeView
                currentCard={currentCard}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
                navigateCards={navigateCards}
                currentIndex={currentIndex}
                cardsLength={cardsLength}
                isMobile={isMobile}
                swipeHandlers={swipeHandlers}
              />
            ) : (
              <div className="w-full overflow-hidden">
                <MultipleChoiceMode 
                  flashcards={flashcards} 
                  deckId={deckId} 
                />
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </DialogWrapper>
  );
};
