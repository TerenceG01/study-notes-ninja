
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
      <div className="relative flex flex-col w-full max-h-[80vh] overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 z-10"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="py-6 px-4 flex-grow overflow-auto">
          <ResponsiveContainer isPopup={true} withPadding={false}>
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
