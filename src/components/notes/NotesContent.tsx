
import { useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";
import { NotesContainer } from "./NotesContainer";
import { NotesHeader } from "./NotesHeader";
import { NoteEditingSection } from "./NoteEditingSection";
import { useNotesFilters } from "@/hooks/useNotesFilters";
import { NotesLoading } from "./NotesLoading";
import { useNoteSelection } from "@/hooks/useNoteSelection";
import { useSidebar } from "@/components/ui/sidebar";

export const NotesContent = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  
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
    <div className={`flex flex-col h-screen space-y-6 w-full max-w-full px-4 sm:px-6 lg:px-8 pt-6 transition-all duration-300 ${isOpen ? 'ml-40' : 'ml-20'}`}>
      <NotesHeader onSearch={setSearchQuery} />
      
      <div className="rounded-lg border bg-card w-full flex-1 flex flex-col">
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
