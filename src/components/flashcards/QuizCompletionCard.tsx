
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
    <Card className="my-4 w-full max-w-full">
      <CardContent className="p-3 sm:p-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center">Quiz Complete!</h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-primary">{percentageScore}%</p>
            <p className="text-base sm:text-lg text-muted-foreground mt-1">{scoreMessage}</p>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground text-center">
            Correct answers: {correctAnswers} out of {totalAttempted}
          </div>
          <Button 
            className="w-full mt-2 sm:mt-3"
            onClick={onRestart}
          >
            Restart Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
