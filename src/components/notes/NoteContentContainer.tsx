import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteHeaderSection } from "./NoteHeaderSection";
import { SummaryControls } from "./SummaryControls";
import { NoteContentEditor } from "./NoteContentEditor";
import { useIsMobile } from "@/hooks/use-mobile";
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
export const NoteContentContainer = ({
  editingNote,
  isFullscreen,
  showSummary,
  summaryLevel,
  summarizing,
  enhancing,
  commonSubjects,
  wordCount,
  lastSaved,
  autoSaveEnabled,
  onNoteChange,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onEnhanceNote,
  onToggleFullscreen,
  onToggleAutoSave,
  onToggleLectureMode
}: NoteContentContainerProps) => {
  const isMobile = useIsMobile();
  return <div className="flex flex-col h-full overflow-hidden">
      <NoteHeaderSection editingNote={editingNote} isFullscreen={isFullscreen} commonSubjects={commonSubjects} lastSaved={lastSaved} autoSaveEnabled={autoSaveEnabled} onNoteChange={onNoteChange} onToggleFullscreen={onToggleFullscreen} onToggleAutoSave={onToggleAutoSave} onToggleLectureMode={onToggleLectureMode} />

      <div className="flex-grow overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="">
          <SummaryControls summaryLevel={summaryLevel} summarizing={summarizing} hasSummary={!!editingNote?.summary} showSummary={showSummary} editingNote={editingNote} enhancing={enhancing} onSummaryLevelChange={onSummaryLevelChange} onGenerateSummary={onGenerateSummary} onToggleSummary={onToggleSummary} onEnhanceNote={onEnhanceNote} />

          <NoteContentEditor editingNote={editingNote} showSummary={showSummary} isFullscreen={isFullscreen} wordCount={wordCount} autoSaveEnabled={autoSaveEnabled} lastSaved={lastSaved} onNoteChange={onNoteChange} onToggleAutoSave={onToggleAutoSave} />
        </div>
      </div>
    </div>;
};