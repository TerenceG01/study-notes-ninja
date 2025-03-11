
import { ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  isFullscreen: boolean;
}

export const DialogWrapper = ({
  open,
  onOpenChange,
  children,
  isFullscreen
}: DialogWrapperProps) => {
  const isMobile = useIsMobile();
  
  // Use Sheet for mobile or fullscreen mode
  if (isMobile || isFullscreen) {
    return (
      <Sheet 
        open={open} 
        onOpenChange={onOpenChange}
      >
        <SheetContent
          side={isMobile ? "bottom" : "top"}
          className={isMobile 
            ? "h-[92vh] p-3 flex flex-col max-h-[92vh] overflow-hidden bg-background rounded-t-xl" 
            : "h-screen w-screen p-6 flex flex-col max-h-screen overflow-hidden bg-background"
          }
        >
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  // Fallback to dialog for desktop non-fullscreen mode
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-6 overflow-hidden bg-background">
        {children}
      </DialogContent>
    </Dialog>
  );
};
