
import { useEffect, useState } from "react";
import { useNotes, Note } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";
import { NotesContainer } from "./NotesContainer";
import { NotesHeader } from "./NotesHeader";
import { NoteEditingSection } from "./NoteEditingSection";
import { useNotesFilters } from "@/hooks/useNotesFilters";
import { NoteCardSkeleton } from "@/components/ui/loading-skeletons";

export const NotesContent = () => {
  const { user } = useAuth();
  const { 
    notes: allNotes, 
    loading, 
    generatingFlashcardsForNote, 
    fetchNotes, 
    generateFlashcards 
  } = useNotes();

  const {
    selectedColor,
    setSelectedColor,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
    currentSubject,
    uniqueSubjects,
    filteredNotes,
    clearFilters,
  } = useNotesFilters(allNotes);

  // Add states for selected and editing notes
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  // Handle note click to open the editing dialog
  const handleNoteClick = (note: Note) => {
    console.log("Note clicked:", note.title);
    setSelectedNote(note);
    setEditingNote(note);
  };

  return (
    <div className="space-y-6 w-full max-w-full px-4 sm:px-0">
      <NotesHeader onSearch={setSearchQuery} />
      
      <div className="rounded-lg border bg-card w-full">
        {loading ? (
          <div className="p-6">
            <div className="space-y-2 mb-6">
              <div className="h-7 w-40 bg-muted rounded-md animate-pulse" />
              <div className="h-4 w-60 bg-muted/70 rounded-md animate-pulse" />
            </div>
            <NoteCardSkeleton />
          </div>
        ) : (
          <NotesContainer
            notes={filteredNotes}
            loading={loading}
            generatingFlashcardsForNote={generatingFlashcardsForNote}
            selectedColor={selectedColor}
            selectedSubject={currentSubject}
            selectedDate={selectedDate}
            uniqueSubjects={uniqueSubjects}
            onColorChange={setSelectedColor}
            onSubjectChange={() => {}}
            onDateChange={setSelectedDate}
            onClearFilters={clearFilters}
            onNoteClick={handleNoteClick}
            onGenerateFlashcards={generateFlashcards}
            onNotesChanged={fetchNotes}
          />
        )}
      </div>

      <div className="mt-6">
        <NoteEditingSection
          onNotesChanged={fetchNotes}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
        />
      </div>
    </div>
  );
};
