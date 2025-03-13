
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";

interface AutoSaveButtonProps {
  autoSaveEnabled: boolean;
  onToggleAutoSave: () => void;
  variant?: "compact" | "full";
}

export const AutoSaveButton = ({
  autoSaveEnabled,
  onToggleAutoSave,
  variant = "full"
}: AutoSaveButtonProps) => {
  // Compact version (mobile)
  if (variant === "compact") {
    return (
      <Button 
        variant={autoSaveEnabled ? "secondary" : "outline"} 
        size="sm" 
        className="text-xs h-8 ml-1 px-2"
        onClick={onToggleAutoSave}
      >
        {autoSaveEnabled ? (
          <Clock className="h-3 w-3" />
        ) : (
          <X className="h-3 w-3" />
        )}
      </Button>
    );
  }
  
  // Full version (desktop)
  return (
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
  );
};
