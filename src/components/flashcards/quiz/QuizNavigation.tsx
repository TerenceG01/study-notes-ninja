
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizNavigationProps {
  currentIndex: number;
  totalCards: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const QuizNavigation = ({ currentIndex, totalCards, onNavigate }: QuizNavigationProps) => {
  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        variant="outline"
        onClick={() => onNavigate('prev')}
        disabled={currentIndex === 0}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous Card
      </Button>

      <Button
        variant="outline"
        onClick={() => onNavigate('next')}
        disabled={currentIndex === totalCards - 1}
      >
        Next Card
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
