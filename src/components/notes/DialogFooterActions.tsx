
import { Button } from "@/components/ui/button";
import { SaveIcon, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogFooterActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaved: boolean;
  saveDisabled?: boolean;
}

export const DialogFooterActions = ({ 
  onSave, 
  onCancel, 
  isSaved,
  saveDisabled = false
}: DialogFooterActionsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex items-center justify-between border-t border-border pt-4 pb-2 mt-3 ${isMobile ? 'px-2' : ''}`}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onCancel}
        className="gap-1"
      >
        <X className="w-4 h-4" />
        Cancel
      </Button>
      
      <Button 
        variant="default" 
        size="sm" 
        onClick={onSave}
        className="gap-1"
        disabled={saveDisabled || isSaved}
      >
        <SaveIcon className="w-4 h-4" />
        {isSaved ? "Saved" : "Save"}
      </Button>
    </div>
  );
};
