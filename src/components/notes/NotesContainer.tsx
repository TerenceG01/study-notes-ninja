
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotesTable } from "./NotesTable";
import { NoteFilters } from "./filters/NoteFilters";
import { Note } from "@/hooks/useNotes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaginationControls } from "@/components/common/PaginationControls";

interface NotesContainerProps {
  notes: Note[];
  loading: boolean;
  generatingFlashcardsForNote: string | null;
  selectedColor: string | null;
  selectedSubject: string | null;
  selectedDate: Date | null;
  uniqueSubjects: string[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onColorChange: (color: string) => void;
  onSubjectChange: (subject: string) => void;
  onDateChange: (date: Date | null) => void;
  onClearFilters: () => void;
  onNoteClick: (note: Note) => void;
  onGenerateFlashcards: (note: Note) => void;
  onNotesChanged: () => void;
}

export const NotesContainer = ({
  notes,
  loading,
  generatingFlashcardsForNote,
  selectedColor,
  selectedSubject,
  selectedDate,
  uniqueSubjects,
  currentPage,
  totalPages,
  onPageChange,
  onColorChange,
  onSubjectChange,
  onDateChange,
  onClearFilters,
  onNoteClick,
  onGenerateFlashcards,
  onNotesChanged,
}: NotesContainerProps) => {
  const uniqueColors = Array.from(new Set(notes.map(note => note.subject_color).filter(Boolean)));

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/40">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Your Notes</CardTitle>
            <CardDescription>Browse and manage your existing notes</CardDescription>
          </div>
          <NoteFilters
            selectedColor={selectedColor}
            selectedSubject={selectedSubject}
            selectedDate={selectedDate}
            uniqueSubjects={uniqueSubjects}
            uniqueColors={uniqueColors}
            onColorChange={onColorChange}
            onSubjectChange={onSubjectChange}
            onDateChange={onDateChange}
            onClearFilters={onClearFilters}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(5*56px+56px)]">
          <NotesTable
            notes={notes}
            loading={loading}
            generatingFlashcardsForNote={generatingFlashcardsForNote}
            onNoteClick={onNoteClick}
            onGenerateFlashcards={onGenerateFlashcards}
            onNotesChanged={onNotesChanged}
          />
        </ScrollArea>
        
        {/* Add pagination controls */}
        <div className="p-4 border-t">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
