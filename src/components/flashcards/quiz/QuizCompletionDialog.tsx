
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface QuizCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  correctAnswers: number;
  totalAttempted: number;
  onRestart: () => void;
}

export const QuizCompletionDialog = ({
  open,
  onOpenChange,
  correctAnswers,
  totalAttempted,
  onRestart,
}: QuizCompletionDialogProps) => {
  const percentageScore = Math.round((correctAnswers / totalAttempted) * 100);
  const scoreMessage =
    percentageScore >= 90
      ? "Excellent!"
      : percentageScore >= 70
      ? "Good job!"
      : percentageScore >= 50
      ? "Keep practicing!"
      : "Don't give up!";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Quiz Complete!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{percentageScore}%</p>
            <p className="text-lg text-muted-foreground mt-2">{scoreMessage}</p>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Correct answers: {correctAnswers} out of {totalAttempted}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button className="w-full" onClick={onRestart}>
              Restart Quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
