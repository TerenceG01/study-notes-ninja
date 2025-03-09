
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
    <div className="flex justify-between items-center mt-4 sm:mt-6">
      <Button
        variant="outline"
        onClick={() => onNavigate('prev')}
        disabled={currentIndex === 0}
        size={isMobile ? "sm" : "default"}
        className={isMobile ? "text-xs" : ""}
      >
        <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
        {isMobile ? "Prev" : "Previous Card"}
      </Button>

      <Button
        variant="outline"
        onClick={() => onNavigate('next')}
        disabled={currentIndex === totalCards - 1}
        size={isMobile ? "sm" : "default"}
        className={isMobile ? "text-xs" : ""}
      >
        {isMobile ? "Next" : "Next Card"}
        <ArrowRight className="h-4 w-4 ml-1 sm:ml-2" />
      </Button>
    </div>
  );
};
