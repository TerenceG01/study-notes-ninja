
import { Button } from "@/components/ui/button";

interface SummaryToggleButtonProps {
  showSummary: boolean;
  isMobile: boolean;
  onToggleSummary: () => void;
}

export const SummaryToggleButton = ({
  showSummary,
  isMobile,
  onToggleSummary
}: SummaryToggleButtonProps) => {
  return (
    <Button 
      variant="outline" 
      onClick={onToggleSummary}
      size={isMobile ? "sm" : "default"}
      className={isMobile ? 'h-9 text-xs px-2' : ''}
    >
      {showSummary ? 'Show Original' : 'Show Summary'}
    </Button>
  );
};
