
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note } from "@/hooks/useNotes";

interface SummaryControlsProps {
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  hasSummary: boolean;
  showSummary: boolean;
  editingNote: Note | null;
  enhancing: boolean;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
}

export const SummaryControls = ({
  summaryLevel,
  summarizing,
  hasSummary,
  showSummary,
  editingNote,
  enhancing,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onEnhanceNote
}: SummaryControlsProps) => {
  return <div className="flex gap-4 items-center mt-4 flex-wrap">
      <Select value={summaryLevel} onValueChange={onSummaryLevelChange}>
        <SelectTrigger className="w-[180px] mx-[5px]">
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
        disabled={summarizing} 
        variant="secondary"
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1 h-10 relative"
            disabled={enhancing || !editingNote?.content}
          >
            {enhancing ? (
              <>
                <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-md flex items-center justify-center animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span className="text-xs font-medium">Enhancing...</span>
                  </div>
                </div>
                <span className="opacity-0">
                  <Wand2 className="h-3.5 w-3.5" />
                  Enhance with AI
                </span>
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5" />
                Enhance with AI
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEnhanceNote('grammar')}>
            Fix Grammar & Spelling
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEnhanceNote('structure')}>
            Improve Structure & Format
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasSummary && <Button variant="outline" onClick={onToggleSummary}>
          {showSummary ? 'Show Original' : 'Show Summary'}
        </Button>}
    </div>;
};
