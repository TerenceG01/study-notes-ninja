
import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { SummaryControls } from "../SummaryControls";
import { NoteContentEditor } from "../NoteContentEditor";

interface NoteContentAreaProps {
  editingNote: Note | null;
  isFullscreen: boolean;
  showSummary: boolean;
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  enhancing: boolean;
  wordCount: number;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  onNoteChange: (note: Note | null) => void;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
  onToggleAutoSave: () => void;
}

export const NoteContentArea = ({
  editingNote,
  isFullscreen,
  showSummary,
  summaryLevel,
  summarizing,
  enhancing,
  wordCount,
  lastSaved,
  autoSaveEnabled,
  onNoteChange,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onEnhanceNote,
  onToggleAutoSave
}: NoteContentAreaProps) => {
  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden no-scrollbar">
      <SummaryControls 
        summaryLevel={summaryLevel} 
        summarizing={summarizing} 
        hasSummary={!!editingNote?.summary} 
        showSummary={showSummary} 
        editingNote={editingNote} 
        enhancing={enhancing} 
        onSummaryLevelChange={onSummaryLevelChange} 
        onGenerateSummary={onGenerateSummary} 
        onToggleSummary={onToggleSummary} 
        onEnhanceNote={onEnhanceNote} 
      />

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
    </div>
  );
};
