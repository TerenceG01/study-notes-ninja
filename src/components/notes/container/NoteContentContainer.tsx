
import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteHeader } from "./NoteHeader";
import { NoteContentArea } from "./NoteContentArea";

interface NoteContentContainerProps {
  editingNote: Note | null;
  isFullscreen: boolean;
  showSummary: boolean;
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  enhancing: boolean;
  commonSubjects: string[];
  wordCount: number;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  onNoteChange: (note: Note | null) => void;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
  onToggleFullscreen: () => void;
  onToggleAutoSave: () => void;
  onToggleLectureMode: () => void;
}

export const NoteContentContainer = (props: NoteContentContainerProps) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <NoteHeader
        editingNote={props.editingNote}
        isFullscreen={props.isFullscreen}
        commonSubjects={props.commonSubjects}
        lastSaved={props.lastSaved}
        autoSaveEnabled={props.autoSaveEnabled}
        onNoteChange={props.onNoteChange}
        onToggleFullscreen={props.onToggleFullscreen}
        onToggleAutoSave={props.onToggleAutoSave}
        onToggleLectureMode={props.onToggleLectureMode}
      />

      <NoteContentArea
        editingNote={props.editingNote}
        isFullscreen={props.isFullscreen}
        showSummary={props.showSummary}
        summaryLevel={props.summaryLevel}
        summarizing={props.summarizing}
        enhancing={props.enhancing}
        wordCount={props.wordCount}
        lastSaved={props.lastSaved}
        autoSaveEnabled={props.autoSaveEnabled}
        onNoteChange={props.onNoteChange}
        onSummaryLevelChange={props.onSummaryLevelChange}
        onGenerateSummary={props.onGenerateSummary}
        onToggleSummary={props.onToggleSummary}
        onEnhanceNote={props.onEnhanceNote}
        onToggleAutoSave={props.onToggleAutoSave}
      />
    </div>
  );
};
