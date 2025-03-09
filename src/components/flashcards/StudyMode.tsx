
import { useSwipeDetection } from "@/hooks/useSwipeDetection";
import { useIsMobile } from "@/hooks/use-mobile";
import { MultipleChoiceMode } from "@/components/flashcards/MultipleChoiceMode";
import { useFlashcardStudy } from "@/hooks/useFlashcardStudy";
import { useFlashcardKeyboardNavigation } from "@/hooks/useFlashcardKeyboardNavigation";
import { StudyModeHeader } from "./study/StudyModeHeader";
import { StandardModeView } from "./study/StandardModeView";

interface StudyModeProps {
  flashcards: any[];
  deckId: string;
}

export const StudyMode = ({ flashcards, deckId }: StudyModeProps) => {
  const isMobile = useIsMobile();
  
  const {
    mode,
    setMode,
    currentIndex,
    isFlipped,
    setIsFlipped,
    cards,
    currentCard,
    navigateCards,
    shuffleCards
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
        <p className="text-lg font-medium mb-4">No flashcards available</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-2 sm:px-0 overflow-hidden">
      <StudyModeHeader
        mode={mode}
        setMode={setMode}
        shuffleCards={shuffleCards}
        currentIndex={currentIndex}
        totalCards={cards.length}
        isMobile={isMobile}
      />

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
        />
      ) : (
        <MultipleChoiceMode flashcards={cards} deckId={deckId} />
      )}
    </div>
  );
};
