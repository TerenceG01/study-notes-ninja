
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note } from "@/hooks/notes";
import { NoteColorPicker } from "./NoteColorPicker";
import { NoteActionMenuItems } from "./NoteActionMenuItems";
import { SUBJECT_COLORS } from "./constants/colors";

interface NoteActionsProps {
  note: Note;
  onShareNote: (note: Note) => void;
  onNotesChanged: () => void;
  updatingNoteId: string | null;
  sharingSubject: string | null;
}

export const NoteActions: React.FC<NoteActionsProps> = ({
  note,
  onShareNote,
  onNotesChanged,
  updatingNoteId,
  sharingSubject,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking dropdown
          disabled={updatingNoteId === note.id || sharingSubject === note.subject}
        >
          {updatingNoteId === note.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side="top" 
        sideOffset={5}
        className="w-48"
      >
        <NoteColorPicker 
          note={note}
          onNotesChanged={onNotesChanged}
          updatingNoteId={updatingNoteId}
        />
        <DropdownMenuSeparator />
        <NoteActionMenuItems
          note={note}
          onShareNote={onShareNote}
          onNotesChanged={onNotesChanged}
          updatingNoteId={updatingNoteId}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { SUBJECT_COLORS };
