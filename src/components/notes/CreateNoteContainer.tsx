
import { CreateNoteHeader } from "./CreateNoteHeader";
import { Note } from "./types";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteContentScrollArea } from "./editor/NoteContentScrollArea";

interface CreateNoteContainerProps {
  newNote: Note;
  isFullscreen: boolean;
  wordCount: number;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  commonSubjects: string[];
  summarizing: boolean;
  summaryLevel: SummaryLevel;
  enhancing: boolean;
  showSummary: boolean;
  onNoteChange: (field: string, value: string | string[]) => void;
  onNoteContentChange: (content: string) => void;
  onToggleAutoSave: () => void;
  onToggleLectureMode: () => void;
  onToggleFullscreen?: () => void;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
}

export const CreateNoteContainer = ({
  newNote,
  isFullscreen,
  wordCount,
  lastSaved,
  autoSaveEnabled,
  commonSubjects,
  summarizing,
  summaryLevel,
  enhancing,
  showSummary,
  onNoteChange,
  onNoteContentChange,
  onToggleAutoSave,
  onToggleLectureMode,
  onToggleFullscreen,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onEnhanceNote
}: CreateNoteContainerProps) => {
  const handleNoteChangeAdapter = (note: Note | null) => {
    if (note) {
      if (note.title !== undefined) onNoteChange('title', note.title || '');
      if (note.content !== undefined) onNoteContentChange(note.content || '');
      if (note.subject !== undefined) onNoteChange('subject', note.subject || 'General');
      if (note.summary !== undefined) onNoteChange('summary', note.summary);
    }
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <CreateNoteHeader 
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

      <NoteContentScrollArea 
        editingNote={{
          id: '',
          title: newNote.title,
          content: newNote.content,
          subject: newNote.subject,
          created_at: new Date().toISOString(),
          folder: 'My Notes',
          summary: newNote.summary
        }}
        isFullscreen={isFullscreen}
        showSummary={showSummary}
        summaryLevel={summaryLevel}
        summarizing={summarizing}
        enhancing={enhancing}
        wordCount={wordCount}
        autoSaveEnabled={autoSaveEnabled}
        lastSaved={lastSaved}
        onNoteChange={handleNoteChangeAdapter}
        onSummaryLevelChange={onSummaryLevelChange}
        onGenerateSummary={onGenerateSummary}
        onToggleSummary={onToggleSummary}
        onEnhanceNote={onEnhanceNote}
        onToggleAutoSave={onToggleAutoSave}
      />
    </div>
  );
};
