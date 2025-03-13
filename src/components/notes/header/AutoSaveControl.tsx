
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";

interface AutoSaveControlProps {
  autoSaveEnabled: boolean;
  onToggleAutoSave: () => void;
  lastSaved: Date | null;
}

export const AutoSaveControl = ({
  autoSaveEnabled,
  onToggleAutoSave,
  lastSaved
}: AutoSaveControlProps) => {
  return (
    <>
      <Button 
        variant={autoSaveEnabled ? "secondary" : "outline"} 
        size="sm" 
        className="text-xs flex-shrink-0 h-8 transition-all"
        onClick={onToggleAutoSave}
      >
        {autoSaveEnabled ? (
          <>
            <Clock className="mr-1 h-3 w-3" />
            Auto-save On
          </>
        ) : (
          <>
            <X className="mr-1 h-3 w-3" />
            Auto-save Off
          </>
        )}
      </Button>
      
      {lastSaved && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      )}
    </>
  );
};
