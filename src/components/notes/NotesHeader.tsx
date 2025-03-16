
import { CommonSubjects } from "./CommonSubjects";
import { DialogFooterActions } from "./DialogFooterActions";
import { NoteCreationControls } from "./header/NoteCreationControls";
import { useNoteEditorState } from "@/hooks/useNoteEditorState";
import { NewNoteDialog } from "./NewNoteDialog";

interface NotesHeaderProps {
  onSearch: (query: string) => void;
}

export const NotesHeader = ({ onSearch }: NotesHeaderProps) => {
  const {
    newNote,
    isEditorExpanded,
    setIsEditorExpanded,
    handleNoteChange,
    handleNoteContentChange,
    isFullscreen,
    summarizing,
    summaryLevel,
    showSummary,
    enhancing,
    handleSave,
    enableFullscreen,
    handleGenerateSummary,
    handleToggleSummary,
    setSummaryLevel,
    handleEnhanceNote,
  } = useNoteEditorState();

  const handleCreateNote = () => {
    setIsEditorExpanded(true);
    enableFullscreen(); // Always open in fullscreen
  };

  return (
    <>
      <NoteCreationControls 
        onSearch={onSearch} 
        onCreateNote={handleCreateNote} 
      />

      <NewNoteDialog
        open={isEditorExpanded} 
        onOpenChange={setIsEditorExpanded}
        newNote={newNote}
        showSummary={showSummary}
        summaryLevel={summaryLevel}
        summarizing={summarizing}
        enhancing={enhancing}
        commonSubjects={CommonSubjects}
        onNoteChange={handleNoteChange}
        onNoteContentChange={handleNoteContentChange}
        onSummaryLevelChange={setSummaryLevel}
        onGenerateSummary={handleGenerateSummary}
        onToggleSummary={handleToggleSummary}
        onEnhanceNote={handleEnhanceNote}
        onSave={handleSave}
        isFullscreen={isFullscreen}
      />
    </>
  );
};
