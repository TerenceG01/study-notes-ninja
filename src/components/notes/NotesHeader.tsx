
import { useState } from "react";
import { CommonSubjects } from "./CommonSubjects";
import { NoteCreationControls } from "./header/NoteCreationControls";
import { useNoteEditorState } from "@/hooks/useNoteEditorState";
import { useToast } from "@/components/ui/use-toast";
import { NewNoteDialog } from "./NewNoteDialog";

interface NotesHeaderProps {
  onSearch: (query: string) => void;
}

export const NotesHeader = ({ onSearch }: NotesHeaderProps) => {
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
  
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

  const handleCreateNote = () => {
    setShowNewNoteDialog(true);
  };

  return (
    <>
      <NoteCreationControls 
        onSearch={onSearch} 
        onCreateNote={handleCreateNote} 
      />
      
      <NewNoteDialog
        open={showNewNoteDialog}
        onOpenChange={setShowNewNoteDialog}
      />
    </>
  );
};
