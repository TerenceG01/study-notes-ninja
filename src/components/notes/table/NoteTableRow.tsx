
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { generateRandomColor } from "@/lib/utils";
import { Note } from "@/hooks/notes/types";
import { NoteActions } from "./NoteActions";

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
  const subjectColor = note.subject_color || generateRandomColor(note.subject || 'default');

  return (
    <TableRow
      key={note.id}
      className="cursor-pointer hover:bg-muted"
      onClick={() => onNoteClick(note)}
    >
      <TableCell className="font-medium">{note.title}</TableCell>
      <TableCell>{note.subject}</TableCell>
      <TableCell className="w-[150px]">
        <div className="flex items-center">
          <span
            className="mr-2 h-4 w-4 rounded-full border"
            style={{ backgroundColor: subjectColor }}
          />
          {note.subject}
        </div>
      </TableCell>
      <TableCell>{format(new Date(note.created_at), "MMM d, yyyy")}</TableCell>
      <TableCell className="text-right">
        <NoteActions
          note={note}
          onShareNote={onShareNote}
          onNotesChanged={onNotesChanged}
          updatingNoteId={updatingNoteId}
          sharingSubject={sharingSubject}
        />
      </TableCell>
    </TableRow>
  );
};
