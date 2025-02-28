
import { useNotesFilters } from "@/hooks/useNotesFilters";
import { NotesContainer } from "./NotesContainer";
import { NotesHeader } from "./NotesHeader";
import { NoteEditingSection } from "./NoteEditingSection";
import { Note } from "@/hooks/useNotes";

interface NotesContentProps {
  notes: Note[];
  loading: boolean;
  generatingFlashcardsForNote: string | null;
  fetchNotes: () => void;
  generateFlashcards: (note: Note) => void;
  onNoteClick: (note: Note) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
}

export const NotesContent = ({
  notes: allNotes,
  loading,
  generatingFlashcardsForNote,
  fetchNotes,
  generateFlashcards,
  onNoteClick,
  newTag,
  setNewTag
}: NotesContentProps) => {
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

  return (
    <div className="space-y-6">
      <NotesHeader onSearch={setSearchQuery} />
      
      <div className="rounded-lg border bg-card">
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
          onNoteClick={onNoteClick}
          onGenerateFlashcards={generateFlashcards}
          onNotesChanged={fetchNotes}
        />
      </div>

      <div className="mt-6">
        <NoteEditingSection
          onNotesChanged={fetchNotes}
          newTag={newTag}
          setNewTag={setNewTag}
        />
      </div>
    </div>
  );
};
