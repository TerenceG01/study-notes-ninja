
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
  // Function to strip HTML tags for display in table
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const displayContent = typeof note.content === 'string' ? stripHtml(note.content) : note.content;

  return (
    <TableRow 
      key={note.id}
      className="group hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onNoteClick(note)}
    >
      <TableCell className="flex items-center gap-1 sm:gap-2 w-[20%] p-2 sm:p-4 max-w-[100px]">
        <div
          className={cn(
            "flex-1 px-1 sm:px-3 py-1 rounded-md font-medium transition-colors text-center text-xs sm:text-sm whitespace-normal break-words",
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
      <TableCell className="font-medium w-[20%] p-2 sm:p-4 text-xs sm:text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate max-w-[100px] sm:max-w-full" title={note.title}>
                {note.title}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              {note.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="hidden md:table-cell w-[30%] p-2 sm:p-4 text-xs sm:text-sm">
        <div className="truncate">
          {displayContent}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell w-[10%] p-2 sm:p-4 text-xs sm:text-sm">
        {new Date(note.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="w-[20%] p-2 sm:p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onGenerateFlashcards(note);
          }}
          disabled={!!generatingFlashcardsForNote}
          className="flex items-center gap-1 sm:gap-2 h-8 text-xs sm:text-sm px-2 sm:px-3 min-w-0 w-full max-w-[110px] sm:max-w-full"
        >
          {generatingFlashcardsForNote === note.id ? (
            <>
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin flex-shrink-0" />
              <span className="truncate">Generating...</span>
            </>
          ) : (
            <>
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Create Flashcards</span>
            </>
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};
