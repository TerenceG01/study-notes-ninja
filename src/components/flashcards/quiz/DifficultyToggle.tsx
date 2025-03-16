
import { useIsMobile } from "@/hooks/use-mobile";

interface DifficultyToggleProps {
  currentIndex: number;
  totalCards: number;
}

export const DifficultyToggle = ({
  currentIndex,
  totalCards
}: DifficultyToggleProps) => {
  const isMobile = useIsMobile();
  
  // Return null to completely remove the component from rendering
  return null;
};
