
import { StudyModeHeader } from "@/components/flashcards/study/StudyModeHeader";
import { Flashcard } from "@/components/flashcards/Flashcard";
import { useFlashcardStudy } from "@/hooks/useFlashcardStudy";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { MultipleChoiceMode } from "@/components/flashcards/MultipleChoiceMode";

interface StudyModeProps {
  flashcards: any[];
  deckId: string;
}

export const StudyMode = ({ flashcards, deckId }: StudyModeProps) => {
  const {
    mode,
    setMode,
    currentIndex,
    isFlipped,
    setIsFlipped,
    cards,
    currentCard,
    updateFlashcardMutation,
    navigateCards,
    shuffleCards // This prop is still used elsewhere, but not passed to StudyModeHeader
  } = useFlashcardStudy(flashcards, deckId);
  
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        navigateCards('prev');
      } else if (event.key === 'ArrowRight') {
        navigateCards('next');
      } else if (event.key === ' ' || event.key === 'Spacebar') {
        setIsFlipped(!isFlipped);
      } else if (event.key === 'f') {
        const element = document.documentElement;
        if (!document.fullscreenElement) {
          element.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable fullscreen:", err);
          });
        } else {
          document.exitFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateCards, setIsFlipped, isFlipped]);
  
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
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          onPrev={() => navigateCards('prev')}
          onNext={() => navigateCards('next')}
          totalCards={cards.length}
          currentIndex={currentIndex}
          updateFlashcard={updateFlashcardMutation.mutate}
        />
      ) : (
        <MultipleChoiceMode flashcards={flashcards} deckId={deckId} />
      )}
    </div>
  );
};
