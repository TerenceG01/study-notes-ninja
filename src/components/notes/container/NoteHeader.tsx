
import { Note } from "@/hooks/useNotes";
import { NoteHeaderSection } from "../NoteHeaderSection";

interface NoteHeaderProps {
  editingNote: Note | null;
  isFullscreen: boolean;
  commonSubjects: string[];
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  onNoteChange: (note: Note | null) => void;
  onToggleFullscreen: () => void;
  onToggleAutoSave: () => void;
  onToggleLectureMode: () => void;
}

export const NoteHeader = ({
  editingNote,
  isFullscreen,
  commonSubjects,
  lastSaved,
  autoSaveEnabled,
  onNoteChange,
  onToggleFullscreen,
  onToggleAutoSave,
  onToggleLectureMode
}: NoteHeaderProps) => {
  return (
    <NoteHeaderSection 
      editingNote={editingNote} 
      isFullscreen={isFullscreen} 
      commonSubjects={commonSubjects} 
      lastSaved={lastSaved} 
      autoSaveEnabled={autoSaveEnabled} 
      onNoteChange={onNoteChange} 
      onToggleFullscreen={onToggleFullscreen} 
      onToggleAutoSave={onToggleAutoSave} 
      onToggleLectureMode={onToggleLectureMode} 
    />
  );
};
