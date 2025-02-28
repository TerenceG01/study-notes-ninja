
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes, Note } from "@/hooks/useNotes";
import { useNotesFilters } from "@/hooks/useNotesFilters";
import { usePaginatedNotes } from "@/hooks/usePaginatedNotes";
import { NavigationSection } from "./NavigationSection";
import { NotesContainer } from "./NotesContainer";
import { CreateNoteContainer } from "./CreateNoteContainer";
import { EditNoteDialog } from "./EditNoteDialog";

export const NotesContent = () => {
  const { user } = useAuth();
  const { 
    notes: allNotes, 
    loading, 
    generatingFlashcardsForNote, 
    isOnline,
    createNote, 
    generateFlashcards, 
    fetchNotes: refreshNotes 
  } = useNotes();
  
  const {
    notes: paginatedNotes,
    loading: loadingPaginated,
    currentPage,
    totalPages,
    goToPage,
    refresh: refreshPaginatedNotes
  } = usePaginatedNotes(user?.id, 10); // Using 10 items per page
  
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

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleCreateNote = async (title: string, content: string, subject: string, tags: string[]) => {
    if (!user) return;
    
    const success = await createNote(
      { title, content, subject, tags },
      user.id
    );
    
    if (success) {
      refreshNotes();
      refreshPaginatedNotes();
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setEditDialogOpen(true);
  };

  const handleGenerateFlashcards = (note: Note) => {
    generateFlashcards(note);
  };

  const handleNotesChanged = () => {
    refreshNotes();
    refreshPaginatedNotes();
  };

  const handleSubjectChange = (subject: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("subject", subject);
    window.history.pushState(null, "", `?${searchParams.toString()}`);
    handleNotesChanged();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/5">
        <NavigationSection
          notes={allNotes}
          onSubjectClick={handleSubjectChange}
          onClearFilters={clearFilters}
        />
      </div>
      
      <div className="flex-1 flex flex-col gap-6">
        <CreateNoteContainer 
          onCreateNote={handleCreateNote}
          isOnline={isOnline}
        />
        
        <NotesContainer
          notes={paginatedNotes}
          loading={loadingPaginated}
          generatingFlashcardsForNote={generatingFlashcardsForNote}
          selectedColor={selectedColor}
          selectedSubject={currentSubject}
          selectedDate={selectedDate}
          uniqueSubjects={uniqueSubjects}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          onColorChange={setSelectedColor}
          onSubjectChange={handleSubjectChange}
          onDateChange={setSelectedDate}
          onClearFilters={clearFilters}
          onNoteClick={handleNoteClick}
          onGenerateFlashcards={handleGenerateFlashcards}
          onNotesChanged={handleNotesChanged}
        />
      </div>
      
      <EditNoteDialog
        note={selectedNote}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onNotesChanged={handleNotesChanged}
      />
    </div>
  );
};
