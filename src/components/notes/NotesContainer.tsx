
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotesTable } from "./NotesTable";
import { NoteFilters } from "./filters/NoteFilters";
import { Note } from "@/hooks/useNotes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import { useEffect, useState } from "react";

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
  const [tableHeight, setTableHeight] = useState("calc(5*56px+56px)");
  
  // Dynamically adjust the table height based on viewport
  useEffect(() => {
    const updateTableHeight = () => {
      // Calculate available space
      const availableHeight = window.innerHeight - 64 - 64 - 64 - 64; 
      // Ensure minimum height shows at least a few rows
      const minHeight = 56 * 3; // 3 rows minimum
      const newHeight = Math.max(availableHeight, minHeight);
      setTableHeight(`${newHeight}px`);
    };

    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    return () => window.removeEventListener('resize', updateTableHeight);
  }, []);

  return (
    <Card className="shadow-sm h-full flex flex-col overflow-hidden">
      <CardHeader className="bg-muted/40 px-2 sm:px-6 py-3 sm:py-4 flex-shrink-0">
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
      <CardContent className="p-0 flex-grow overflow-hidden">
        <div className="relative h-full overflow-hidden">
          <ScrollArea className="h-full min-h-[250px] max-w-full overflow-hidden" style={{ height: tableHeight }}>
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
