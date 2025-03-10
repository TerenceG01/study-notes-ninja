
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex ${isMobile ? 'flex-wrap gap-2' : 'gap-4'} items-center mt-3 mb-1`}>
      <Select value={summaryLevel} onValueChange={onSummaryLevelChange}>
        <SelectTrigger className={`${isMobile ? 'w-full max-w-[150px] h-9 text-xs' : 'w-[180px]'}`}>
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
        size={isMobile ? "sm" : "default"}
        className={`relative ${isMobile ? 'h-9 text-xs px-2' : ''}`}
      >
        {summarizing ? (
          <>
            <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm rounded-md flex items-center justify-center animate-fade-in">
              <div className="flex items-center space-x-2">
                <Sparkles className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-primary animate-pulse`} />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Summarizing...</span>
              </div>
            </div>
            <span className="opacity-0">Generate Summary</span>
          </>
        ) : (
          <>
            {isMobile ? (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span>Summarize</span>
              </>
            ) : 'Generate Summary'}
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size={isMobile ? "sm" : "sm"} 
            variant="outline" 
            className={`gap-1 ${isMobile ? 'h-9 px-2 aspect-square' : 'h-10'} relative`}
            disabled={enhancing || !editingNote?.content}
            title={isMobile ? "Enhance with AI" : ""}
          >
            {enhancing ? (
              <>
                <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-md flex items-center justify-center animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    {!isMobile && <span className="text-xs font-medium">Enhancing...</span>}
                  </div>
                </div>
                <span className="opacity-0">
                  <Wand2 className="h-3.5 w-3.5" />
                  {!isMobile && "Enhance"}
                </span>
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5" />
                {!isMobile && "Enhance with AI"}
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

      {hasSummary && (
        <Button 
          variant="outline" 
          onClick={onToggleSummary}
          size={isMobile ? "sm" : "default"}
          className={isMobile ? 'h-9 text-xs px-2 ml-auto' : ''}
        >
          {showSummary ? 'Show Original' : 'Show Summary'}
        </Button>
      )}
    </div>
  );
};
