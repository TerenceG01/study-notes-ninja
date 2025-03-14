
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
import { Loader2, Share2 } from "lucide-react";
import { NotesList } from "./NotesList";
import { useMultiShareNote } from "./useMultiShareNote";

interface MultiShareDialogProps {
  groupId: string;
}

export const MultiShareDialog: React.FC<MultiShareDialogProps> = ({ groupId }) => {
  const {
    notes,
    sharedNotes,
    open,
    loadingNotes,
    loadingSharedNotes,
    isPending,
    handleOpenChange,
    isDisabled,
    shareMultipleNotes
  } = useMultiShareNote(groupId);
  
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  
  const handleSelectNote = (noteId: string, selected: boolean) => {
    if (selected) {
      setSelectedNotes((prev) => [...prev, noteId]);
    } else {
      setSelectedNotes((prev) => prev.filter((id) => id !== noteId));
    }
  };
  
  const handleShareSelected = async () => {
    if (selectedNotes.length === 0) return;
    await shareMultipleNotes(selectedNotes);
    setSelectedNotes([]);
  };

  const selectAll = () => {
    if (!notes) return;
    // Filter out already shared notes
    const unsharedNotes = notes
      .filter(note => !sharedNotes?.includes(note.id))
      .map(note => note.id);
    setSelectedNotes(unsharedNotes);
  };

  const clearSelection = () => {
    setSelectedNotes([]);
  };

  const unsharedNotesCount = notes?.filter(note => !sharedNotes?.includes(note.id)).length || 0;
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Multiple Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Multiple Notes</DialogTitle>
          <DialogDescription>
            Select notes to share with your study group members
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearSelection}
            disabled={selectedNotes.length === 0}
          >
            Clear
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={selectAll}
            disabled={unsharedNotesCount === 0}
          >
            Select All
          </Button>
        </div>
        
        <div className="py-4">
          <NotesList
            notes={notes}
            sharedNotes={sharedNotes}
            isLoading={loadingNotes || loadingSharedNotes}
            isPending={isPending}
            onShareToggle={() => {}} // Not used in multi-select mode
            multiSelectMode={true}
            selectedNotes={selectedNotes}
            onSelectNote={handleSelectNote}
          />
        </div>
        
        <DialogFooter>
          <Button
            onClick={handleShareSelected}
            disabled={selectedNotes.length === 0 || isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              <>Share {selectedNotes.length} note{selectedNotes.length !== 1 ? 's' : ''}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
