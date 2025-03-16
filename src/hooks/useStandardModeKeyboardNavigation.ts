
import { useEffect } from "react";

export const useStandardModeKeyboardNavigation = ({
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

    if (!isMobile) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateCards, setIsFlipped, isFlipped, isMobile]);
};
