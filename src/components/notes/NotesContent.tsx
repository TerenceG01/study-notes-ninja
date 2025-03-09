
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
  const {
    user
  } = useAuth();
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
    clearFilters
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
  return <div className="flex flex-col h-[calc(100vh-140px)] max-h-[calc(100vh-120px)] w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">My Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit and organize your notes
          </p>
        </div>
      </div>
      
      <div className="flex-shrink-0 mb-2">
        <NotesHeader onSearch={setSearchQuery} />
      </div>
      
      <div className="rounded-lg border bg-card w-full flex-1 flex flex-col overflow-hidden min-h-0 py-0 my-[8px]">
        {loading ? <NotesLoading /> : <NotesContainer notes={filteredNotes} loading={loading} generatingFlashcardsForNote={generatingFlashcardsForNote} selectedColor={selectedColor} selectedSubject={currentSubject} selectedDate={selectedDate} uniqueSubjects={uniqueSubjects} onColorChange={setSelectedColor} onSubjectChange={() => {}} onDateChange={setSelectedDate} onClearFilters={clearFilters} onNoteClick={handleNoteClick} onGenerateFlashcards={generateFlashcards} onNotesChanged={fetchNotes} />}
      </div>

      <NoteEditingSection onNotesChanged={fetchNotes} selectedNote={selectedNote} setSelectedNote={setSelectedNote} editingNote={editingNote} setEditingNote={setEditingNote} />
    </div>;
};
