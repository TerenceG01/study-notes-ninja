
import { Button } from "@/components/ui/button";
import { Brain, Check } from "lucide-react";

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
            <Button variant={mode === 'standard' ? 'default' : 'outline'} onClick={() => setMode('standard')}>
              <Brain className="h-4 w-4 mr-2" />
              Standard Mode
            </Button>
            <Button variant={mode === 'multiple-choice' ? 'default' : 'outline'} onClick={() => setMode('multiple-choice')}>
              <Check className="h-4 w-4 mr-2" />
              Multiple Choice
            </Button>
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
              className="px-2 h-8 text-xs"
            >
              <Brain className="h-3 w-3 mr-1" />
              Standard
            </Button>
            <Button 
              variant={mode === 'multiple-choice' ? 'default' : 'outline'} 
              onClick={() => setMode('multiple-choice')}
              size="sm"
              className="px-2 h-8 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Multiple Choice
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
