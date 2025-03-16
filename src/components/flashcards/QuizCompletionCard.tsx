
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizCompletionCardProps {
  correctAnswers: number;
  totalAttempted: number;
  onRestart: () => void;
}

export const QuizCompletionCard = ({ correctAnswers, totalAttempted, onRestart }: QuizCompletionCardProps) => {
  const percentageScore = Math.round((correctAnswers / totalAttempted) * 100);
  const scoreMessage = 
    percentageScore >= 90 ? "Excellent!" :
    percentageScore >= 70 ? "Good job!" :
    percentageScore >= 50 ? "Keep practicing!" :
    "Don't give up!";

  return (
    <Card className="w-full max-w-full">
      <CardContent className="p-2 sm:p-3">
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-center">Quiz Complete!</h3>
        <div className="space-y-1 sm:space-y-2">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-primary">{percentageScore}%</p>
            <p className="text-sm sm:text-base text-muted-foreground">{scoreMessage}</p>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Correct answers: {correctAnswers} out of {totalAttempted}
          </div>
          <Button 
            className="w-full mt-1 sm:mt-2 py-1 h-8"
            onClick={onRestart}
            size="sm"
          >
            Restart Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
