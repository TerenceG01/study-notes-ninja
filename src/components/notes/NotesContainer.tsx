
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotesTable } from "./NotesTable";
import { NoteFilters } from "./filters/NoteFilters";
import { Note } from "@/hooks/useNotes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableSkeleton } from "@/components/ui/loading-skeletons";
import { useEffect, useState, useCallback } from "react";

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
  const [tableHeight, setTableHeight] = useState("auto");
  
  // Update table dimensions based on viewport and container size
  const updateTableDimensions = useCallback(() => {
    // Get the container element
    const container = document.querySelector('.notes-container-card');
    if (!container) return;
    
    // Get the header height
    const header = container.querySelector('.card-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    
    // Calculate available height within the card
    const containerHeight = container.getBoundingClientRect().height;
    const availableHeight = containerHeight - headerHeight - 2; // 2px for border
    
    setTableHeight(`${Math.max(availableHeight, 200)}px`);
  }, []);

  useEffect(() => {
    updateTableDimensions();
    window.addEventListener('resize', updateTableDimensions);
    
    // Use a timeout to ensure the dimensions are recalculated after DOM updates
    const resizeTimeout = setTimeout(updateTableDimensions, 100);
    
    return () => {
      window.removeEventListener('resize', updateTableDimensions);
      clearTimeout(resizeTimeout);
    };
  }, [updateTableDimensions, notes.length]);

  return (
    <Card className="shadow-sm h-full flex flex-col w-full notes-container-card">
      <CardHeader className="bg-muted/40 px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0 card-header">
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
      <CardContent className="p-0 flex-grow overflow-hidden w-full">
        <div className="relative h-full w-full overflow-hidden" style={{ height: tableHeight }}>
          <ScrollArea className="h-full w-full">
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
