
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
  const [tableHeight, setTableHeight] = useState("calc(100% - 28px)");
  
  // Dynamically adjust the table height based on filters visibility
  useEffect(() => {
    const updateTableHeight = () => {
      const header = document.querySelector('.notes-container-header');
      const headerHeight = header ? header.getBoundingClientRect().height : 28;
      const container = document.querySelector('.notes-card-container');
      
      if (container) {
        const containerHeight = container.getBoundingClientRect().height;
        // Add some buffer for potential wrapping
        setTableHeight(`${containerHeight - headerHeight - 4}px`);
      }
    };

    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    
    // Run update after a short delay to ensure all elements are rendered
    const timeoutId = setTimeout(updateTableHeight, 100);
    
    // Update height when filters change
    const filtersChangeTimeoutId = setTimeout(updateTableHeight, 200);
    
    return () => {
      window.removeEventListener('resize', updateTableHeight);
      clearTimeout(timeoutId);
      clearTimeout(filtersChangeTimeoutId);
    };
  }, [selectedColor, selectedSubject, selectedDate]);

  return (
    <Card className="shadow-sm h-full flex flex-col overflow-hidden notes-card-container">
      <CardHeader className="bg-muted/40 px-2 py-2 flex-shrink-0 notes-container-header">
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-medium">
                {selectedSubject ? `${selectedSubject} Notes` : 'Your Notes'}
              </CardTitle>
              <CardDescription className="text-xs">
                {selectedSubject 
                  ? `Viewing notes for ${selectedSubject}`
                  : 'Browse and manage your existing notes'}
              </CardDescription>
            </div>
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
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        <div className="relative h-full overflow-hidden">
          <ScrollArea className="h-full min-h-[400px] max-w-full overflow-hidden" style={{ height: tableHeight }}>
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
