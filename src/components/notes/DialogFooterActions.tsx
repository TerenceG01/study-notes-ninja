
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save } from "lucide-react";

interface DialogFooterActionsProps {
  onSave: () => void;
  onCancel: () => void;
}

export const DialogFooterActions = ({
  onSave,
  onCancel,
}: DialogFooterActionsProps) => {
  return (
    <DialogFooter className="flex justify-end space-x-2 py-2 bg-background/90 backdrop-blur-sm fixed bottom-0 left-0 right-0 border-t z-10 px-6 shadow-sm">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSave} className="gap-2 bg-primary hover:bg-primary/90 transition-colors">
        <Save className="h-4 w-4" />
        Save Changes
      </Button>
    </DialogFooter>
  );
};
