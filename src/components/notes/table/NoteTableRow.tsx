
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Note } from "@/hooks/useNotes";
import { NoteActions } from "./NoteActions";
import { SUBJECT_COLORS } from "./constants/colors";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NoteTableRowProps {
  note: Note;
  generatingFlashcardsForNote: string | null;
  updatingNoteId: string | null;
  sharingSubject: string | null;
  onNoteClick: (note: Note) => void;
  onGenerateFlashcards: (note: Note) => void;
  onShareNote: (note: Note) => void;
  onNotesChanged: () => void;
}

export const NoteTableRow: React.FC<NoteTableRowProps> = ({
  note,
  generatingFlashcardsForNote,
  updatingNoteId,
  sharingSubject,
  onNoteClick,
  onGenerateFlashcards,
  onShareNote,
  onNotesChanged,
}) => {
  return (
    <TableRow 
      key={note.id}
      className="group hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onNoteClick(note)}
    >
      <TableCell className="flex items-center gap-2 w-[20%]">
        <div
          className={cn(
            "flex-1 px-3 py-1 rounded-md font-medium transition-colors text-center",
            note.subject_color ? 
              SUBJECT_COLORS.find(c => c.value === note.subject_color)?.class : 
              "bg-primary/5 text-primary hover:bg-primary/10"
          )}
        >
          {note.subject || 'General'}
        </div>
        <NoteActions 
          note={note}
          onShareNote={onShareNote}
          onNotesChanged={onNotesChanged}
          updatingNoteId={updatingNoteId}
          sharingSubject={sharingSubject}
        />
      </TableCell>
      <TableCell className="font-medium w-[20%]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate" title={note.title}>
                {note.title}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              {note.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="hidden md:table-cell w-[30%]">
        <div className="truncate">
          {note.content}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell w-[10%]">
        {new Date(note.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="w-[20%]">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onGenerateFlashcards(note);
          }}
          disabled={!!generatingFlashcardsForNote}
          className="flex items-center gap-2"
        >
          {generatingFlashcardsForNote === note.id ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4" />
              Create Flashcards
            </>
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};
