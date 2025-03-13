
import { Note } from "@/hooks/useNotes";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { TitleSubjectEditor } from "./TitleSubjectEditor";
import { MobileNoteHeader } from "./header/MobileNoteHeader";
import { DesktopNoteHeader } from "./header/DesktopNoteHeader";

interface NoteHeaderSectionProps {
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

export const NoteHeaderSection = ({
  editingNote,
  isFullscreen,
  commonSubjects,
  lastSaved,
  autoSaveEnabled,
  onNoteChange,
  onToggleFullscreen,
  onToggleAutoSave,
  onToggleLectureMode
}: NoteHeaderSectionProps) => {
  const isMobile = useIsMobile();
  const [editorOpen, setEditorOpen] = useState(false);
  
  const handleDismiss = () => {
    // Find the dismiss button and click it safely
    const dismissButton = document.querySelector('[data-radix-preferred-dismiss]');
    if (dismissButton instanceof HTMLElement) {
      dismissButton.click();
    }
  };
  
  return (
    <>
      <div className="bg-card rounded-lg p-2 sm:p-3 shadow-sm border border-border mb-2">
        {isMobile ? (
          <MobileNoteHeader
            editingNote={editingNote}
            autoSaveEnabled={autoSaveEnabled}
            onOpenTitleEditor={() => setEditorOpen(true)}
            onToggleAutoSave={onToggleAutoSave}
            onToggleLectureMode={onToggleLectureMode}
            onDismiss={handleDismiss}
          />
        ) : (
          <DesktopNoteHeader 
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
        )}
      </div>
      
      <TitleSubjectEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editingNote={editingNote}
        commonSubjects={commonSubjects}
        onNoteChange={onNoteChange}
      />
    </>
  );
};
