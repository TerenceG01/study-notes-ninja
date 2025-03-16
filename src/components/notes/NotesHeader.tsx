
import { CommonSubjects } from "./CommonSubjects";
import { NoteCreationControls } from "./header/NoteCreationControls";
import { useNoteEditorState } from "@/hooks/useNoteEditorState";
import { useToast } from "@/components/ui/use-toast";

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
    setIsEditorExpanded,
  } = useNoteEditorState();
  
  const { toast } = useToast();

  const handleCreateNote = () => {
    // Disable the create note functionality
    toast({
      title: "Feature Disabled",
      description: "The create note dialog has been disabled.",
    });
  };

  return (
    <NoteCreationControls 
      onSearch={onSearch} 
      onCreateNote={handleCreateNote} 
    />
  );
};
