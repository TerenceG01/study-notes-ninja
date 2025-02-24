
import { useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useAuth } from "@/contexts/AuthContext";
import { NotesContainer } from "./NotesContainer";
import { NotesHeader } from "./NotesHeader";
import { NoteEditingSection } from "./NoteEditingSection";
import { useNotesFilters } from "@/hooks/useNotesFilters";

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
    newTag,
    setNewTag,
  } = useNoteEditor();

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

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  return (
    <div className="mx-auto max-w-[min(100%,64rem)] flex flex-col space-y-4 h-full">
      <NotesHeader onSearch={setSearchQuery} />
      <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg">
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
          onNoteClick={(note) => {}}
          onGenerateFlashcards={generateFlashcards}
          onNotesChanged={fetchNotes}
        />
      </div>

      <NoteEditingSection
        onNotesChanged={fetchNotes}
        newTag={newTag}
        setNewTag={setNewTag}
      />
    </div>
  );
};
