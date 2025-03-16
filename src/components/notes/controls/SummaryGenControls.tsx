
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SummaryGenControlsProps {
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  hasContent: boolean;
  isMobile: boolean;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
}

export const SummaryGenControls = ({
  summaryLevel,
  summarizing,
  hasContent,
  isMobile,
  onSummaryLevelChange,
  onGenerateSummary
}: SummaryGenControlsProps) => {
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            disabled={summarizing} 
            variant="secondary"
            size="sm"
            className="h-9 text-xs px-2 relative"
          >
            {summarizing ? (
              <>
                <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm rounded-md flex items-center justify-center animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span className="text-xs font-medium">Summarizing...</span>
                  </div>
                </div>
                <span className="opacity-0">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  <span>Summarize</span>
                </span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span>Summarize</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem 
            onClick={() => {
              onSummaryLevelChange('brief');
              onGenerateSummary();
            }}
            disabled={!hasContent}
          >
            Brief Summary (30%)
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              onSummaryLevelChange('medium');
              onGenerateSummary();
            }}
            disabled={!hasContent}
          >
            Medium Summary (50%)
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              onSummaryLevelChange('detailed');
              onGenerateSummary();
            }}
            disabled={!hasContent}
          >
            Detailed Summary (70%)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <>
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
      
      <Button 
        onClick={onGenerateSummary} 
        disabled={summarizing || !hasContent} 
        variant="secondary"
        size="default"
        className="relative"
      >
        {summarizing ? (
          <>
            <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm rounded-md flex items-center justify-center animate-fade-in">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">Summarizing...</span>
              </div>
            </div>
            <span className="opacity-0">Generate Summary</span>
          </>
        ) : 'Generate Summary'}
      </Button>
    </>
  );
};
