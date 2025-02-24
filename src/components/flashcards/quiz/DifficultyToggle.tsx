
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface DifficultyToggleProps {
  hardMode: boolean;
  onToggle: () => void;
  currentIndex: number;
  totalCards: number;
}

export const DifficultyToggle = ({ hardMode, onToggle, currentIndex, totalCards }: DifficultyToggleProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-sm text-muted-foreground">
        Card {currentIndex + 1} of {totalCards}
      </div>
      <Button
        variant={hardMode ? "default" : "outline"}
        onClick={onToggle}
        className="gap-2"
      >
        <Zap className={`h-4 w-4 ${hardMode ? "text-yellow-300" : ""}`} />
        {hardMode ? "Switch to Standard Mode" : "Switch to Hard Mode"}
      </Button>
    </div>
  );
};
