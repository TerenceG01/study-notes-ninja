
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuizNavigationProps {
  currentIndex: number;
  totalCards: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const QuizNavigation = ({ currentIndex, totalCards, onNavigate }: QuizNavigationProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex justify-between'} mt-4 sm:mt-6 w-full`}>
      <Button
        variant="outline"
        onClick={() => onNavigate('prev')}
        disabled={currentIndex === 0}
        size={isMobile ? "sm" : "default"}
        className={`${isMobile ? 'w-full text-xs' : 'w-auto'}`}
      >
        <ArrowLeft className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
        {isMobile ? "Prev" : "Previous Card"}
      </Button>

      <Button
        variant="outline"
        onClick={() => onNavigate('next')}
        disabled={currentIndex === totalCards - 1}
        size={isMobile ? "sm" : "default"}
        className={`${isMobile ? 'w-full text-xs' : 'w-auto'}`}
      >
        {isMobile ? "Next" : "Next Card"}
        <ArrowRight className={`${isMobile ? 'h-3 w-3 ml-1' : 'h-4 w-4 ml-2'}`} />
      </Button>
    </div>
  );
};
