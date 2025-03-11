
import { useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";
import { NotesContainer } from "./NotesContainer";
import { NotesHeader } from "./NotesHeader";
import { NoteEditingSection } from "./NoteEditingSection";
import { useNotesFilters } from "@/hooks/useNotesFilters";
import { NotesLoading } from "./NotesLoading";
import { useNoteSelection } from "@/hooks/useNoteSelection";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export const NotesContent = () => {
  const { user } = useAuth();
  const {
    notes: allNotes,
    loading,
    generatingFlashcardsForNote,
    fetchNotes,
    generateFlashcards
  } = useNotes();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSubject = searchParams.get("subject");
  
  const {
    selectedColor,
    setSelectedColor,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
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
  
  const handleSubjectClick = (subject: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("subject", subject);
    setSearchParams(newParams);
  };
  
  const handleClearSubject = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("subject");
    setSearchParams(newParams);
  };
  
  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">My Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit and organize your notes
          </p>
        </div>
      </div>
      
      <div className="flex-shrink-0 mb-1">
        <NotesHeader onSearch={setSearchQuery} />
      </div>
      
      {/* Active subject filter indicator - more compact */}
      {currentSubject && (
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
            <span className="text-xs">Subject:</span> 
            <span className="font-medium truncate max-w-[150px]">{currentSubject}</span>
            <button 
              className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-muted"
              onClick={handleClearSubject}
              aria-label="Clear subject filter"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}
      
      <div className="rounded-lg border bg-card w-full flex-1 flex flex-col overflow-hidden min-h-0 py-0 my-1">
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
            onSubjectChange={handleSubjectClick} 
            onDateChange={setSelectedDate} 
            onClearFilters={clearFilters} 
            onNoteClick={handleNoteClick} 
            onGenerateFlashcards={generateFlashcards} 
            onNotesChanged={fetchNotes} 
          />
        )}
      </div>

      <NoteEditingSection 
        onNotesChanged={fetchNotes} 
        selectedNote={selectedNote} 
        setSelectedNote={setSelectedNote} 
        editingNote={editingNote} 
        setEditingNote={setEditingNote} 
      />
    </div>
  );
};
