
import { CommonSubjects } from "./CommonSubjects";
import { NoteCreationControls } from "./header/NoteCreationControls";
import { useNoteEditorState } from "@/hooks/useNoteEditorState";

interface NotesHeaderProps {
  onSearch: (query: string) => void;
}

export const NotesHeader = ({ onSearch }: NotesHeaderProps) => {
  const {
    handleNoteChange,
    handleNoteContentChange,
    handleSave,
    handleGenerateSummary,
    handleToggleSummary,
    setSummaryLevel,
    handleEnhanceNote,
  } = useNoteEditorState();

  const handleCreateNote = () => {
    // We'll implement this differently in the future
    console.log("Create note functionality has been removed");
  };

  return (
    <NoteCreationControls 
      onSearch={onSearch} 
      onCreateNote={handleCreateNote} 
    />
  );
};
