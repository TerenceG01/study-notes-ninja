
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { NotesList } from "./NotesList";
import { useShareNote } from "./useShareNote";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShareNoteDialogProps {
  groupId: string;
}

export const ShareNoteDialog: React.FC<ShareNoteDialogProps> = ({ groupId }) => {
  const isMobile = useIsMobile();
  
  const {
    notes,
    sharedNotes,
    open,
    loadingNotes,
    loadingSharedNotes,
    isPending,
    handleShareToggle,
    handleShareMultiple,
    handleOpenChange,
    isDisabled
  } = useShareNote(groupId);

  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedNotes([]);
  };

  const handleSelectToggle = (noteId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedNotes(prev => [...prev, noteId]);
    } else {
      setSelectedNotes(prev => prev.filter(id => id !== noteId));
    }
  };

  const selectAll = () => {
    if (!notes) return;
    const unsharedNotes = notes
      .filter(note => !sharedNotes?.includes(note.id))
      .map(note => note.id);
    setSelectedNotes(unsharedNotes);
  };

  const clearSelection = () => {
    setSelectedNotes([]);
  };

  const shareSelected = () => {
    handleShareMultiple(selectedNotes);
    setSelectedNotes([]);
    setIsMultiSelectMode(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled}>
          <Share2 className="h-4 w-4 mr-2" />
          {!isMobile && "Share Notes"}
        </Button>
      </DialogTrigger>
      <DialogContent className={isMobile ? "w-[95vw] p-3 max-w-[95vw]" : "sm:max-w-[600px]"}>
        <DialogHeader className={isMobile ? "mb-2" : ""}>
          <DialogTitle>Share Notes with Group</DialogTitle>
          <DialogDescription className={isMobile ? "text-xs" : ""}>
            {isMultiSelectMode 
              ? "Select multiple notes to share with your study group members" 
              : "Select individual notes to share with your study group members"}
          </DialogDescription>
        </DialogHeader>
        
        <div className={`flex ${isMobile ? "flex-col gap-2" : "justify-between items-center"} mb-4`}>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={toggleMultiSelectMode}
            className={isMobile ? "text-xs py-1 h-8" : ""}
          >
            {isMultiSelectMode ? "Single Select Mode" : "Multi-Select Mode"}
          </Button>
          
          {isMultiSelectMode && (
            <div className={`flex gap-2 ${isMobile ? "mt-1" : ""}`}>
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                onClick={selectAll}
                className={isMobile ? "text-xs py-1 h-8" : ""}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                onClick={clearSelection}
                className={isMobile ? "text-xs py-1 h-8" : ""}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
        
        <div className="py-2">
          <NotesList
            notes={notes}
            sharedNotes={sharedNotes}
            isLoading={loadingNotes || loadingSharedNotes}
            isPending={isPending}
            onShareToggle={handleShareToggle}
            isMultiSelect={isMultiSelectMode}
            selectedNotes={selectedNotes}
            onSelectToggle={handleSelectToggle}
            isMobile={isMobile}
          />
        </div>
        
        {isMultiSelectMode && (
          <DialogFooter className={`mt-4 ${isMobile ? "flex-col gap-2" : ""}`}>
            <div className={`flex w-full ${isMobile ? "flex-col gap-2" : "justify-between items-center"}`}>
              <div className={`text-sm text-muted-foreground ${isMobile ? "text-center" : ""}`}>
                {selectedNotes.length} notes selected
              </div>
              <Button 
                onClick={shareSelected}
                disabled={selectedNotes.length === 0 || isPending}
                className={isMobile ? "w-full" : ""}
              >
                Share Selected Notes
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
