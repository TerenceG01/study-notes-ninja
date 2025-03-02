
import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteHeaderSection } from "./NoteHeaderSection";
import { TagsSection } from "./TagsSection";
import { SummaryControls } from "./SummaryControls";
import { NoteContentEditor } from "./NoteContentEditor";

interface NoteContentContainerProps {
  editingNote: Note | null;
  isFullscreen: boolean;
  showSummary: boolean;
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  enhancing: boolean;
  newTag: string;
  commonSubjects: string[];
  wordCount: number;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  onNoteChange: (note: Note | null) => void;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
  onNewTagChange: (tag: string) => void;
  onToggleFullscreen: () => void;
  onToggleAutoSave: () => void;
}

export const NoteContentContainer = ({
  editingNote,
  isFullscreen,
  showSummary,
  summaryLevel,
  summarizing,
  enhancing,
  newTag,
  commonSubjects,
  wordCount,
  lastSaved,
  autoSaveEnabled,
  tags,
  onTagsChange,
  onNoteChange,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onEnhanceNote,
  onNewTagChange,
  onToggleFullscreen,
  onToggleAutoSave
}: NoteContentContainerProps) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <NoteHeaderSection 
        editingNote={editingNote}
        isFullscreen={isFullscreen}
        commonSubjects={commonSubjects}
        lastSaved={lastSaved}
        autoSaveEnabled={autoSaveEnabled}
        onNoteChange={onNoteChange}
        onToggleFullscreen={onToggleFullscreen}
        onToggleAutoSave={onToggleAutoSave}
      />

      <ScrollArea className="flex-grow overflow-y-auto pr-2">
        <div className="space-y-6 pr-2 pb-16">
          <TagsSection 
            tags={tags}
            newTag={newTag}
            onTagsChange={onTagsChange}
            onNewTagChange={onNewTagChange}
            editingNote={editingNote}
            onNoteChange={onNoteChange}
          />

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
      </ScrollArea>
    </div>
  );
};
