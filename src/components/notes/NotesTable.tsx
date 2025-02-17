
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, MoreVertical, ChevronUp, ChevronDown, Share, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

const SUBJECT_COLORS = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { name: 'Green', value: 'green', class: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { name: 'Red', value: 'red', class: 'bg-red-50 text-red-600 hover:bg-red-100' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
];

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
              <TableCell className="flex items-center gap-2">
                <div
                  onClick={() => onNoteClick(note)}
                  className={cn(
                    "flex-1 px-3 py-1 rounded-md font-medium transition-colors",
                    note.subject_color ? 
                      SUBJECT_COLORS.find(c => c.value === note.subject_color)?.class : 
                      "bg-primary/5 text-primary hover:bg-primary/10"
                  )}
                >
                  {note.subject || 'General'}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                      Subject Color
                    </div>
                    <div className="grid grid-cols-5 gap-1 p-2">
                      {SUBJECT_COLORS.map((color) => (
                        <Button
                          key={color.value}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-6 w-6 p-0 rounded-full",
                            color.class
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Add color change handler
                          }}
                        />
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2">
                      <ChevronUp className="h-4 w-4" />
                      Move Up
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <ChevronDown className="h-4 w-4" />
                      Move Down
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Share className="h-4 w-4" />
                      Share Subject
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Remove Subject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
