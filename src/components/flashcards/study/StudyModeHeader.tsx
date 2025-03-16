
import { Button } from "@/components/ui/button";
import { Brain, Check, Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface StudyModeHeaderProps {
  mode: 'standard' | 'multiple-choice';
  setMode: (mode: 'standard' | 'multiple-choice') => void;
  currentIndex: number;
  totalCards: number;
  isMobile: boolean;
}

export const StudyModeHeader = ({
  mode,
  setMode,
  currentIndex,
  totalCards,
  isMobile
}: StudyModeHeaderProps) => {
  return (
    <>
      <div className={`${isMobile ? 'flex justify-between items-center mb-3' : 'flex justify-between items-center mb-5'}`}>
        {isMobile ? (
          <div className="text-xs text-muted-foreground">
            {currentIndex + 1}/{totalCards}
          </div>
        ) : (
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={mode === 'standard' ? 'default' : 'outline'} 
                    onClick={() => setMode('standard')}
                    className="relative"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Standard Mode
                    {mode === 'standard' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Classic flashcard experience</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={mode === 'multiple-choice' ? 'default' : 'outline'} 
                    onClick={() => setMode('multiple-choice')}
                    className="relative"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Multiple Choice
                    {mode === 'multiple-choice' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Test yourself with multiple choice questions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {!isMobile && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" />
            <span>Card {currentIndex + 1} of {totalCards}</span>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="mb-3">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={mode === 'standard' ? 'default' : 'outline'} 
              onClick={() => setMode('standard')}
              size="sm"
              className="px-2 h-8 text-xs relative"
            >
              <Brain className="h-3 w-3 mr-1" />
              Standard
              {mode === 'standard' && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full" />
              )}
            </Button>
            <Button 
              variant={mode === 'multiple-choice' ? 'default' : 'outline'} 
              onClick={() => setMode('multiple-choice')}
              size="sm"
              className="px-2 h-8 text-xs relative"
            >
              <Check className="h-3 w-3 mr-1" />
              Multiple Choice
              {mode === 'multiple-choice' && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full" />
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
