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
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm py-2 border-b border-border flex flex-wrap items-center justify-between">
      <div className={`flex ${isMobile ? 'flex-wrap gap-2' : 'gap-4'} items-center`}>
        {!isMobile && (
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
        )}
        
        {isMobile ? (
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
              >
                Brief Summary (30%)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  onSummaryLevelChange('medium');
                  onGenerateSummary();
                }}
              >
                Medium Summary (50%)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  onSummaryLevelChange('detailed');
                  onGenerateSummary();
                }}
              >
                Detailed Summary (70%)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={onGenerateSummary} 
            disabled={summarizing} 
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
        )}

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
      </div>

      {hasSummary && (
        <Button 
          variant="outline" 
          onClick={onToggleSummary}
          size={isMobile ? "sm" : "default"}
          className={isMobile ? 'h-9 text-xs px-2' : ''}
        >
          {showSummary ? 'Show Original' : 'Show Summary'}
        </Button>
      )}
    </div>
  );
};
