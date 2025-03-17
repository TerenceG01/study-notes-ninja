
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DifficultyToggleProps {
  currentIndex: number;
  totalCards: number;
}

export const DifficultyToggle = ({
  currentIndex,
  totalCards
}: DifficultyToggleProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-between items-center mb-3 sm:mb-4">
      <div className="text-xs sm:text-sm text-muted-foreground">
        {currentIndex + 1}/{totalCards}
      </div>
    </div>
  );
};
