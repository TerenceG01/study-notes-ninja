
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface DifficultyToggleProps {
  hardMode: boolean;
  onToggle: () => void;
  currentIndex: number;
  totalCards: number;
}

export const DifficultyToggle = ({
  hardMode,
  onToggle,
  currentIndex,
  totalCards
}: DifficultyToggleProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-between items-center mb-3 sm:mb-4">
      <div className="text-xs sm:text-sm text-muted-foreground">
        {currentIndex + 1}/{totalCards}
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="hard-mode"
          checked={hardMode}
          onCheckedChange={onToggle}
          size={isMobile ? "sm" : "default"}
        />
        <Label htmlFor="hard-mode" className="text-xs sm:text-sm">
          Hard Mode
        </Label>
      </div>
    </div>
  );
};
