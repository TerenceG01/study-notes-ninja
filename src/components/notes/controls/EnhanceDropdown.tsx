
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note } from "@/hooks/useNotes";

interface EnhanceDropdownProps {
  enhancing: boolean;
  hasContent: boolean;
  isMobile: boolean;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
}

export const EnhanceDropdown = ({
  enhancing,
  hasContent,
  isMobile,
  onEnhanceNote
}: EnhanceDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size={isMobile ? "sm" : "sm"} 
          variant="outline" 
          className={`gap-1 ${isMobile ? 'h-9 px-2 aspect-square' : 'h-10'} relative`}
          disabled={enhancing}
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
        <DropdownMenuItem 
          onClick={() => onEnhanceNote('grammar')}
          disabled={!hasContent}
        >
          Fix Grammar & Spelling
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onEnhanceNote('structure')}
          disabled={!hasContent}
        >
          Improve Structure & Format
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
