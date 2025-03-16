
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";

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
      className={`gap-1 ${isMobile ? 'h-9 text-xs px-2' : ''}`}
    >
      <ArrowLeftRight className="h-3.5 w-3.5 mr-1" />
      {showSummary ? 'Show Original' : 'Show Summary'}
    </Button>
  );
};
