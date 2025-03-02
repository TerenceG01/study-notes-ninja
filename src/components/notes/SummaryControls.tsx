
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SummaryLevel } from "@/hooks/useNoteSummary";

interface SummaryControlsProps {
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  hasSummary: boolean;
  showSummary: boolean;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
}

export const SummaryControls = ({
  summaryLevel,
  summarizing,
  hasSummary,
  showSummary,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary
}: SummaryControlsProps) => {
  return (
    <div className="flex gap-4 items-center mt-4">
      <Select value={summaryLevel} onValueChange={onSummaryLevelChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Summary Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="brief">Brief (30%)</SelectItem>
          <SelectItem value="medium">Medium (50%)</SelectItem>
          <SelectItem value="detailed">Detailed (70%)</SelectItem>
        </SelectContent>
      </Select>
      
      <Button onClick={onGenerateSummary} disabled={summarizing} variant="secondary">
        {summarizing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Summarizing...
          </>
        ) : 'Generate Summary'}
      </Button>

      {hasSummary && (
        <Button variant="outline" onClick={onToggleSummary}>
          {showSummary ? 'Show Original' : 'Show Summary'}
        </Button>
      )}
    </div>
  );
};
