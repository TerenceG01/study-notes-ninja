
import { useSwipeDetection } from "@/hooks/useSwipeDetection";
import { useIsMobile } from "@/hooks/use-mobile";
import { MultipleChoiceMode } from "@/components/flashcards/MultipleChoiceMode";
import { useFlashcardStudy } from "@/hooks/useFlashcardStudy";
import { useFlashcardKeyboardNavigation } from "@/hooks/useFlashcardKeyboardNavigation";
import { StudyModeHeader } from "./study/StudyModeHeader";
import { StandardModeView } from "./study/StandardModeView";
import { useState } from "react";
import { FlashcardPopup } from "./popup/FlashcardPopup";

interface StudyModeProps {
  flashcards: any[];
  deckId: string;
}

export const StudyMode = ({ flashcards, deckId }: StudyModeProps) => {
  const isMobile = useIsMobile();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const {
    mode,
    setMode,
    currentIndex,
    isFlipped,
    setIsFlipped,
    cards,
    currentCard,
    navigateCards,
  } = useFlashcardStudy(flashcards, deckId);

  const swipeHandlers = useSwipeDetection(
    () => navigateCards('next'),       // Swipe left to go to next card
    () => navigateCards('prev'),       // Swipe right to go to previous card
    () => setIsFlipped(!isFlipped)     // Swipe up to flip card
  );

  // Setup keyboard navigation
  useFlashcardKeyboardNavigation({
    isFlipped,
    setIsFlipped,
    navigateCards,
    isMobile
  });

  if (!currentCard) {
    return (
      <div className="text-center py-8 w-full mx-auto">
        <p className="text-lg font-medium text-primary mb-4">No flashcards available</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-2 sm:px-0 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <StudyModeHeader
          mode={mode}
          setMode={setMode}
          currentIndex={currentIndex}
          totalCards={cards.length}
          isMobile={isMobile}
        />
      </div>

      {mode === 'standard' ? (
        <StandardModeView
          currentCard={currentCard}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          navigateCards={navigateCards}
          currentIndex={currentIndex}
          cardsLength={cards.length}
          isMobile={isMobile}
          swipeHandlers={isMobile ? swipeHandlers : {}}
          onExpand={() => setIsPopupOpen(true)}
        />
      ) : (
        <div className="w-full max-w-full overflow-hidden px-2 sm:px-0">
          <MultipleChoiceMode 
            flashcards={cards} 
            deckId={deckId} 
            onExpand={() => setIsPopupOpen(true)}
          />
        </div>
      )}

      {/* Popup for flashcard display */}
      <FlashcardPopup
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        mode={mode}
        flashcards={cards}
        deckId={deckId}
        currentIndex={currentIndex}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        navigateCards={navigateCards}
        cardsLength={cards.length}
        isMobile={isMobile}
        swipeHandlers={isMobile ? swipeHandlers : {}}
      />
    </div>
  );
};
