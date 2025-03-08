
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotesTable } from "./NotesTable";
import { NoteFilters } from "./filters/NoteFilters";
import { Note } from "@/hooks/useNotes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableSkeleton } from "@/components/ui/loading-skeletons";

interface NotesContainerProps {
  notes: Note[];
  loading: boolean;
  generatingFlashcardsForNote: string | null;
  selectedColor: string | null;
  selectedSubject: string | null;
  selectedDate: Date | null;
  uniqueSubjects: string[];
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
      <CardHeader className="bg-muted/40 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg font-medium">Your Notes</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Browse and manage your existing notes</CardDescription>
          </div>
          <div className="self-end sm:self-auto">
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
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative max-h-[calc(5*56px+56px)] overflow-hidden">
          <ScrollArea className="h-[calc(5*56px+56px)]" type="always">
            {loading ? (
              <TableSkeleton rows={5} />
            ) : (
              <NotesTable
                notes={notes}
                loading={loading}
                generatingFlashcardsForNote={generatingFlashcardsForNote}
                onNoteClick={onNoteClick}
                onGenerateFlashcards={onGenerateFlashcards}
                onNotesChanged={onNotesChanged}
              />
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
