
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogFooterActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaved?: boolean;
}

export const DialogFooterActions = ({
  onSave,
  onCancel,
  isSaved = false,
}: DialogFooterActionsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <DialogFooter className="flex justify-end space-x-3 py-3 bg-background fixed bottom-0 left-0 right-0 border-t z-10 px-6 shadow-sm">
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="transition-all hover:bg-muted"
      >
        Cancel
      </Button>
      {!isMobile && (
        <Button 
          onClick={onSave} 
          className={`gap-2 transition-all shadow-sm hover:shadow-md ${isSaved ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      )}
    </DialogFooter>
  );
};
