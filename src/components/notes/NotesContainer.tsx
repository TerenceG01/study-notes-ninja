import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotesTable } from "./NotesTable";
import { NoteFilters } from "./filters/NoteFilters";
import { Note } from "@/hooks/useNotes";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className="h-full shadow-sm border-muted/20">
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
            uniqueColors={uniqueColors}
            onColorChange={onColorChange}
            onSubjectChange={onSubjectChange}
            onDateChange={onDateChange}
            onClearFilters={onClearFilters}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-5rem)]">
        <ScrollArea className="h-full">
          <NotesTable
            notes={notes}
            loading={loading}
            generatingFlashcardsForNote={generatingFlashcardsForNote}
            onNoteClick={onNoteClick}
            onGenerateFlashcards={onGenerateFlashcards}
            onNotesChanged={onNotesChanged}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
