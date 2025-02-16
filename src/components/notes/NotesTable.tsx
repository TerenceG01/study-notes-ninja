
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder: string;
  summary?: string;
  tags?: string[];
  subject?: string;
  workbook: string;
}

interface NotesTableProps {
  notes: Note[];
  loading: boolean;
  generatingFlashcardsForNote: string | null;
  onNoteClick: (note: Note) => void;
  onGenerateFlashcards: (note: Note) => void;
}

export const NotesTable = ({
  notes,
  loading,
  generatingFlashcardsForNote,
  onNoteClick,
  onGenerateFlashcards,
}: NotesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Workbook</TableHead>
          <TableHead className="hidden md:table-cell">Content</TableHead>
          <TableHead className="hidden sm:table-cell">Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading notes...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : notes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <p className="text-muted-foreground">No notes found. Create your first note above!</p>
            </TableCell>
          </TableRow>
        ) : (
          notes.map((note) => (
            <TableRow 
              key={note.id}
              className="group hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <TableCell 
                className="font-medium"
                onClick={() => onNoteClick(note)}
              >
                {note.title}
              </TableCell>
              <TableCell
                onClick={() => onNoteClick(note)}
              >
                {note.subject || 'General'}
              </TableCell>
              <TableCell
                onClick={() => onNoteClick(note)}
              >
                {note.workbook}
              </TableCell>
              <TableCell 
                className="max-w-md truncate hidden md:table-cell"
                onClick={() => onNoteClick(note)}
              >
                {note.content}
              </TableCell>
              <TableCell 
                className="hidden sm:table-cell"
                onClick={() => onNoteClick(note)}
              >
                {new Date(note.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onGenerateFlashcards(note)}
                  disabled={!!generatingFlashcardsForNote}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
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
          ))
        )}
      </TableBody>
    </Table>
  );
};
