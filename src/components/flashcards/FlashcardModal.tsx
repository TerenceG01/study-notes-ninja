
import { useEffect } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { EnhancedFlashcard } from "@/components/flashcards/EnhancedFlashcard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCard: any;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  navigateCards: (direction: 'prev' | 'next') => void;
  currentIndex: number;
  cardsLength: number;
}

export const FlashcardModal = ({
  isOpen,
  onClose,
  currentCard,
  isFlipped,
  setIsFlipped,
  navigateCards,
  currentIndex,
  cardsLength
}: FlashcardModalProps) => {
  const isMobile = useIsMobile();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMobile) return;
      
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
        case 'Escape':
          onClose();
          break;
        case 'f':
          setIsFullscreen(!isFullscreen);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFlipped, navigateCards, onClose, isMobile, setIsFlipped, isFullscreen]);

  // Toggle fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error("Error attempting to enable fullscreen:", e);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => {
        console.error("Error attempting to exit fullscreen:", e);
      });
    }
  }, [isFullscreen]);

  const modalContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cardsLength}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="w-full h-[350px] sm:h-[400px] flex items-center">
        <EnhancedFlashcard 
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={setIsFlipped}
          onNext={() => navigateCards('next')}
          onPrev={() => navigateCards('prev')}
        />
      </div>

      <div className="flex justify-between items-center mt-4 w-full">
        <Button 
          variant="outline" 
          onClick={() => navigateCards('prev')} 
          disabled={currentIndex === 0}
          size={isMobile ? "sm" : "default"}
          className="w-[45%] sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {isMobile ? "Prev" : "Previous Card"}
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigateCards('next')} 
          disabled={currentIndex === cardsLength - 1}
          size={isMobile ? "sm" : "default"}
          className="w-[45%] sm:w-auto"
        >
          {isMobile ? "Next" : "Next Card"}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="text-center mt-2 text-[10px] sm:text-xs text-muted-foreground w-full break-words">
        {isMobile ? 
          "Swipe left/right to navigate" : 
          "Arrow keys to navigate • Space to flip • F for fullscreen"}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[85vh] p-4 pb-6 flex flex-col">
          {modalContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] w-full h-auto flex flex-col p-6">
        {modalContent}
      </DialogContent>
    </Dialog>
  );
};
