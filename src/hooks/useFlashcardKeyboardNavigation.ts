
import { useEffect } from "react";

export const useFlashcardKeyboardNavigation = ({
  isFlipped,
  setIsFlipped,
  navigateCards,
  isMobile
}: {
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  navigateCards: (direction: 'prev' | 'next') => void;
  isMobile: boolean;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip keyboard shortcuts on mobile to avoid conflicts with virtual keyboard
      if (isMobile) return;
      
      // Add global keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            navigateCards('prev');
            break;
          case 'ArrowRight':
            e.preventDefault();
            navigateCards('next');
            break;
          case 'f':
            e.preventDefault();
            setIsFlipped(!isFlipped);
            break;
        }
      } else {
        // Simple keyboard navigation
        switch (e.key) {
          case 'ArrowLeft':
            navigateCards('prev');
            break;
          case 'ArrowRight':
            navigateCards('next');
            break;
          case ' ': // Spacebar
            e.preventDefault();
            setIsFlipped(!isFlipped);
            break;
          case 'Enter':
            setIsFlipped(!isFlipped);
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, navigateCards, isMobile, setIsFlipped]);
};
