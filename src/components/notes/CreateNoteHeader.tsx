
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TitleSubjectEditor } from "./TitleSubjectEditor";
import { MobileCreateHeader } from "./header/MobileCreateHeader";
import { DesktopCreateHeader } from "./header/DesktopCreateHeader";
import { Note } from "./types";

interface CreateNoteHeaderProps {
  newNote: Note;
  isFullscreen: boolean;
  commonSubjects: string[];
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  onNoteChange: (field: string, value: string | string[]) => void;
  onToggleAutoSave: () => void;
  onToggleLectureMode: () => void;
  onToggleFullscreen?: () => void;
}

export const CreateNoteHeader = ({
  newNote,
  isFullscreen,
  commonSubjects,
  lastSaved,
  autoSaveEnabled,
  onNoteChange,
  onToggleAutoSave,
  onToggleLectureMode,
  onToggleFullscreen
}: CreateNoteHeaderProps) => {
  const isMobile = useIsMobile();
  const [editorOpen, setEditorOpen] = useState(false);
  
  const handleDismiss = () => {
    const dismissButton = document.querySelector('[data-radix-preferred-dismiss]');
    if (dismissButton instanceof HTMLElement) {
      dismissButton.click();
    }
  };
  
  return (
    <>
      <div className="bg-card rounded-lg p-2 sm:p-3 shadow-sm border border-border mb-2">
        {isMobile ? (
          <MobileCreateHeader
            newNote={newNote}
            autoSaveEnabled={autoSaveEnabled}
            onOpenTitleEditor={() => setEditorOpen(true)}
            onToggleAutoSave={onToggleAutoSave}
            onToggleLectureMode={onToggleLectureMode}
            onDismiss={handleDismiss}
          />
        ) : (
          <DesktopCreateHeader 
            newNote={newNote}
            isFullscreen={isFullscreen}
            commonSubjects={commonSubjects}
            lastSaved={lastSaved}
            autoSaveEnabled={autoSaveEnabled}
            onNoteChange={onNoteChange}
            onToggleAutoSave={onToggleAutoSave}
            onToggleLectureMode={onToggleLectureMode}
            onToggleFullscreen={onToggleFullscreen}
          />
        )}
      </div>
      
      <TitleSubjectEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editingNote={{
          id: '',
          title: newNote.title,
          content: newNote.content,
          subject: newNote.subject,
          created_at: newNote.created_at,
          folder: newNote.folder
        }}
        commonSubjects={commonSubjects}
        onNoteChange={(note) => {
          if (note) {
            onNoteChange('title', note.title || '');
            onNoteChange('subject', note.subject || 'General');
          }
        }}
      />
    </>
  );
};
