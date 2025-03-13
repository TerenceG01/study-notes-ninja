
import { useIsMobile } from "@/hooks/use-mobile";
import { NoteContentEditor } from "./NoteContentEditor";
import { CreateNoteHeader } from "./CreateNoteHeader";
import { Note } from "./types";
import { SummaryControls } from "./SummaryControls";
import { SummaryLevel } from "@/hooks/useNoteSummary";

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
  const isMobile = useIsMobile();
  
  const handleContentChange = (html: string) => {
    onNoteContentChange(html);
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

      <div className="flex-grow overflow-y-auto overflow-x-hidden no-scrollbar mb-16">
        <div className={`space-y-2 ${isMobile ? 'px-1' : 'px-2 sm:px-4'} max-w-full`}>
          <SummaryControls 
            summaryLevel={summaryLevel}
            summarizing={summarizing}
            hasSummary={!!newNote?.summary}
            showSummary={showSummary}
            editingNote={newNote}
            enhancing={enhancing}
            onSummaryLevelChange={onSummaryLevelChange}
            onGenerateSummary={onGenerateSummary}
            onToggleSummary={onToggleSummary}
            onEnhanceNote={onEnhanceNote}
          />

          <NoteContentEditor 
            editingNote={newNote}
            showSummary={showSummary}
            isFullscreen={isFullscreen}
            wordCount={wordCount}
            autoSaveEnabled={autoSaveEnabled}
            lastSaved={lastSaved}
            onNoteChange={(note) => {
              if (note) {
                onNoteChange('title', note.title || '');
                onNoteContentChange(note.content || '');
                onNoteChange('subject', note.subject || 'General');
              }
            }}
            onToggleAutoSave={onToggleAutoSave}
          />
        </div>
      </div>
    </div>
  );
};
