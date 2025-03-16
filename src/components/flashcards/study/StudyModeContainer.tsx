
import React from "react";
import { StudyModeHeader } from "@/components/flashcards/study/StudyModeHeader";
import { StandardModeView } from "@/components/flashcards/study/StandardModeView";
import { MultipleChoiceMode } from "@/components/flashcards/MultipleChoiceMode";
import { useStandardModeKeyboardNavigation } from "@/hooks/useStandardModeKeyboardNavigation";
import { useFlashcardStudy } from "@/hooks/useFlashcardStudy";
import { useIsMobile } from "@/hooks/use-mobile";

interface StudyModeContainerProps {
  flashcards: any[];
  deckId: string;
}

export const StudyModeContainer: React.FC<StudyModeContainerProps> = ({ 
  flashcards, 
  deckId 
}) => {
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
  
  // Setup keyboard navigation for standard mode
  useStandardModeKeyboardNavigation({
    isFlipped,
    setIsFlipped,
    navigateCards,
    isMobile
  });
  
  return (
    <div className="w-full max-w-full space-y-4">
      <StudyModeHeader
        mode={mode}
        setMode={setMode}
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
          shuffleCards={shuffleCards}
        />
      ) : (
        <MultipleChoiceMode flashcards={flashcards} deckId={deckId} />
      )}
    </div>
  );
};
