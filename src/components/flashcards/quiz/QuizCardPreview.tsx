
import { Card, CardContent } from "@/components/ui/card";
import { Maximize2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizCardPreviewProps {
  currentCard: any;
  currentIndex: number;
  totalCards: number;
  onOpenModal: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const QuizCardPreview = ({
  currentCard,
  currentIndex,
  totalCards,
  onOpenModal,
  onNavigate
}: QuizCardPreviewProps) => {
  return (
    <>
      {/* Card Preview */}
      <Card className="w-full shadow-sm border hover:shadow-md transition-all cursor-pointer mt-4" onClick={onOpenModal}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
            <span>Multiple Choice Quiz</span>
            <span>Question {currentIndex + 1} of {totalCards}</span>
          </div>
          <div className="min-h-[150px] flex items-center justify-center">
            <p className="text-lg font-medium text-center">
              {currentCard.question.length > 100 
                ? currentCard.question.substring(0, 100) + "..." 
                : currentCard.question}
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={(e) => {
              e.stopPropagation();
              onOpenModal();
            }}>
              <Maximize2 className="h-4 w-4 mr-1" />
              Open Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between mt-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('prev')} 
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-none"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('next')} 
            disabled={currentIndex === totalCards - 1}
            className="flex-1 sm:flex-none"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <Button 
          variant="default" 
          onClick={onOpenModal}
          className="w-full sm:w-auto"
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Take Quiz
        </Button>
      </div>
      
      <div className="text-center mt-4 text-xs text-muted-foreground">
        <p>Tip: Navigate through questions and test your knowledge with multiple choice options</p>
      </div>
    </>
  );
};
