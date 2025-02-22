
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotesTable } from "./NotesTable";
import { NoteFilters } from "./filters/NoteFilters";
import { Note } from "@/hooks/useNotes";

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
  return (
    <Card className="shadow-sm border-muted/20">
      <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
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
            onColorChange={onColorChange}
            onSubjectChange={onSubjectChange}
            onDateChange={onDateChange}
            onClearFilters={onClearFilters}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <NotesTable
          notes={notes}
          loading={loading}
          generatingFlashcardsForNote={generatingFlashcardsForNote}
          onNoteClick={onNoteClick}
          onGenerateFlashcards={onGenerateFlashcards}
          onNotesChanged={onNotesChanged}
        />
      </CardContent>
    </Card>
  );
};
