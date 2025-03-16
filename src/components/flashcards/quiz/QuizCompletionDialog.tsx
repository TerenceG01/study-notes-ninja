
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Award } from "lucide-react";

interface QuizCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  correctAnswers: number;
  totalAttempted: number;
  onRestart: () => void;
}

export const QuizCompletionDialog = ({
  isOpen,
  onClose,
  correctAnswers,
  totalAttempted,
  onRestart
}: QuizCompletionDialogProps) => {
  const isMobile = useIsMobile();
  const percentageScore = Math.round((correctAnswers / totalAttempted) * 100);
  
  const scoreMessage = 
    percentageScore >= 90 ? "Excellent!" :
    percentageScore >= 70 ? "Good job!" :
    percentageScore >= 50 ? "Keep practicing!" :
    "Don't give up!";

  const content = (
    <>
      <DialogHeader className="text-center pb-2">
        <DialogTitle className="text-xl font-semibold flex items-center justify-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Quiz Complete!
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-2">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">{percentageScore}%</p>
          <p className="text-lg text-muted-foreground mt-2">{scoreMessage}</p>
        </div>
        <div className="text-sm text-muted-foreground text-center">
          Correct answers: {correctAnswers} out of {totalAttempted}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mt-6">
          <Button 
            variant="outline"
            onClick={onClose}
            className="sm:flex-1"
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              onRestart();
              onClose();
            }}
            className="sm:flex-1"
          >
            Restart Quiz
          </Button>
        </div>
      </div>
    </>
  );
  
  // Use AlertDialog for mobile to appear as a modal overlay
  if (isMobile) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-[350px] p-6">
          {content}
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  // Use Dialog for desktop
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-6">
        {content}
      </DialogContent>
    </Dialog>
  );
};
