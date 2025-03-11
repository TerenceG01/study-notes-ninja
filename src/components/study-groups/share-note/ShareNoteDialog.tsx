
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { NotesList } from "./NotesList";
import { useShareNote } from "./useShareNote";

interface ShareNoteDialogProps {
  groupId: string;
}

export const ShareNoteDialog: React.FC<ShareNoteDialogProps> = ({ groupId }) => {
  const {
    notes,
    sharedNotes,
    open,
    loadingNotes,
    loadingSharedNotes,
    isPending,
    handleShareToggle,
    handleOpenChange,
    isDisabled
  } = useShareNote(groupId);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Notes with Group</DialogTitle>
          <DialogDescription>
            Select individual notes to share with your study group members
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <NotesList
            notes={notes}
            sharedNotes={sharedNotes}
            isLoading={loadingNotes || loadingSharedNotes}
            isPending={isPending}
            onShareToggle={handleShareToggle}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
