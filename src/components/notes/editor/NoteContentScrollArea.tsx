
import { Note } from "../types";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { SummaryControls } from "../SummaryControls";
import { NoteEditorArea } from "./NoteEditorArea";

interface NoteContentScrollAreaProps {
  editingNote: Note | null;
  isFullscreen: boolean;
  showSummary: boolean;
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  enhancing: boolean;
  wordCount: number;
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  onNoteChange: (note: Note | null) => void;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
  onToggleAutoSave: () => void;
}

export const NoteContentScrollArea = ({
  editingNote,
  isFullscreen,
  showSummary,
  summaryLevel,
  summarizing,
  enhancing,
  wordCount,
  autoSaveEnabled,
  lastSaved,
  onNoteChange,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onEnhanceNote,
  onToggleAutoSave
}: NoteContentScrollAreaProps) => {
  // Check if there's a summary available
  const hasSummary = editingNote?.summary && editingNote.summary.trim().length > 0;
  
  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden no-scrollbar">
      <SummaryControls 
        summaryLevel={summaryLevel}
        summarizing={summarizing}
        hasSummary={hasSummary}
        showSummary={showSummary}
        editingNote={editingNote}
        enhancing={enhancing}
        onSummaryLevelChange={onSummaryLevelChange}
        onGenerateSummary={onGenerateSummary}
        onToggleSummary={onToggleSummary}
        onEnhanceNote={onEnhanceNote}
      />

      <NoteEditorArea 
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
