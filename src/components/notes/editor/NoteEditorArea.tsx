
import { Note } from "../types";
import { NoteContentEditor } from "../NoteContentEditor";

interface NoteEditorAreaProps {
  editingNote: Note | null;
  showSummary: boolean;
  isFullscreen: boolean;
  wordCount: number;
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  onNoteChange: (note: Note | null) => void;
  onToggleAutoSave: () => void;
}

export const NoteEditorArea = ({
  editingNote,
  showSummary,
  isFullscreen,
  wordCount,
  autoSaveEnabled,
  lastSaved,
  onNoteChange,
  onToggleAutoSave
}: NoteEditorAreaProps) => {
  return (
    <div className="mb-16">
      <NoteContentEditor 
        editingNote={editingNote} 
        showSummary={showSummary} 
        isFullscreen={isFullscreen} 
        wordCount={wordCount} 
        autoSaveEnabled={autoSaveEnabled} 
        lastSaved={lastSaved} 
        onNoteChange={onNoteChange} 
        onToggleAutoSave={onToggleAutoSave} 
      />
    </div>
  );
};
