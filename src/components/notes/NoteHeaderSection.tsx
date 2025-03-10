
import { Maximize2, Minimize2, Clock, X, ChevronLeft } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Note } from "@/hooks/useNotes";
import { useIsMobile } from "@/hooks/use-mobile";

interface NoteHeaderSectionProps {
  editingNote: Note | null;
  isFullscreen: boolean;
  commonSubjects: string[];
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  onNoteChange: (note: Note | null) => void;
  onToggleFullscreen: () => void;
  onToggleAutoSave: () => void;
}

export const NoteHeaderSection = ({
  editingNote,
  isFullscreen,
  commonSubjects,
  lastSaved,
  autoSaveEnabled,
  onNoteChange,
  onToggleFullscreen,
  onToggleAutoSave
}: NoteHeaderSectionProps) => {
  const isMobile = useIsMobile();
  
  const handleDismiss = () => {
    // Find the dismiss button and click it safely
    const dismissButton = document.querySelector('[data-radix-preferred-dismiss]');
    if (dismissButton instanceof HTMLElement) {
      dismissButton.click();
    }
  };
  
  return (
    <div className="bg-card rounded-lg p-2 sm:p-3 shadow-sm border border-border mb-2">
      <div className="flex justify-between items-center">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDismiss}
            className="mr-1 h-8 w-8 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        <DialogHeader className="flex-grow space-y-0 p-0">
          <DialogTitle className="text-base">
            <Input 
              value={editingNote?.title || ""} 
              onChange={e => onNoteChange(editingNote ? {
                ...editingNote,
                title: e.target.value
              } : null)} 
              placeholder="Note Title" 
              className="text-base font-semibold border-none shadow-none focus-visible:ring-1 bg-background h-8 px-2"
            />
          </DialogTitle>
        </DialogHeader>
        
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleFullscreen} 
            className="ml-2 hover:bg-muted h-8 w-8"
          >
            {isFullscreen ? 
              <Minimize2 className="h-4 w-4" /> : 
              <Maximize2 className="h-4 w-4" />
            }
          </Button>
        )}
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-1 md:grid-cols-3 gap-2'} mt-2`}>
        <div className={isMobile ? 'col-span-1' : 'md:col-span-2'}>
          <Select 
            value={editingNote?.subject || "General"} 
            onValueChange={value => onNoteChange(editingNote ? {
              ...editingNote,
              subject: value
            } : null)}
          >
            <SelectTrigger className="w-full bg-background border-border h-8">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {commonSubjects.map(subject => (
                <SelectItem 
                  key={subject} 
                  value={subject} 
                  className="hover:bg-muted cursor-pointer"
                >
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <Button 
            variant={autoSaveEnabled ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs flex-shrink-0 h-8 transition-all"
            onClick={onToggleAutoSave}
          >
            {autoSaveEnabled ? (
              <>
                <Clock className="mr-1 h-3 w-3" />
                Auto-save {isMobile ? "" : "On"}
              </>
            ) : (
              <>
                <X className="mr-1 h-3 w-3" />
                Auto-save {isMobile ? "" : "Off"}
              </>
            )}
          </Button>
          
          {lastSaved && !isMobile && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
