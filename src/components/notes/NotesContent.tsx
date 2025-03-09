
import { useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";
import { NotesContainer } from "./NotesContainer";
import { NotesHeader } from "./NotesHeader";
import { NoteEditingSection } from "./NoteEditingSection";
import { useNotesFilters } from "@/hooks/useNotesFilters";
import { NotesLoading } from "./NotesLoading";
import { useNoteSelection } from "@/hooks/useNoteSelection";

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

  const {
    selectedNote,
    setSelectedNote,
    editingNote,
    setEditingNote,
    handleNoteClick
  } = useNoteSelection();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden space-y-4 sm:space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Notes</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Create, edit and organize your notes
          </p>
        </div>
      </div>
      
      <NotesHeader onSearch={setSearchQuery} />
      
      <div className="rounded-lg border bg-card w-full flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <NotesLoading />
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

      <div className="mt-2 mb-4 w-full max-w-full overflow-hidden">
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
