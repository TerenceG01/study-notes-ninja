
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder: string;
  summary?: string;
  tags?: string[];
  subject?: string;
  subject_color?: string;
}

interface NotesTableProps {
  notes: Note[];
  loading: boolean;
  generatingFlashcardsForNote: string | null;
  onNoteClick: (note: Note) => void;
  onGenerateFlashcards: (note: Note) => void;
}

const getSubjectStyles = (color?: string) => {
  const baseStyles = "font-medium transition-colors";
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    green: "bg-green-50 text-green-600 group-hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    red: "bg-red-50 text-red-600 group-hover:bg-red-100",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
  };

  return cn(
    baseStyles,
    color ? colorMap[color] : "bg-primary/5 text-primary group-hover:bg-primary/10"
  );
};

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
          <TableHead className="font-semibold text-primary">Subject</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="hidden md:table-cell">Content</TableHead>
          <TableHead className="hidden sm:table-cell">Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading notes...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : notes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
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
                onClick={() => onNoteClick(note)}
                className={getSubjectStyles(note.subject_color)}
              >
                {note.subject || 'General'}
              </TableCell>
              <TableCell 
                className="font-medium"
                onClick={() => onNoteClick(note)}
              >
                {note.title}
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
