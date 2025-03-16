
import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { useIsMobile } from "@/hooks/use-mobile";
import { SummaryGenControls } from "./controls/SummaryGenControls";
import { EnhanceDropdown } from "./controls/EnhanceDropdown";
import { SummaryToggleButton } from "./controls/SummaryToggleButton";

interface SummaryControlsProps {
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  hasSummary: boolean;
  showSummary: boolean;
  editingNote: Note | null;
  enhancing: boolean;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
}

export const SummaryControls = ({
  summaryLevel,
  summarizing,
  hasSummary,
  showSummary,
  editingNote,
  enhancing,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onEnhanceNote
}: SummaryControlsProps) => {
  const isMobile = useIsMobile();
  
  // Check if we have content to work with for the AI features
  const hasContent = editingNote && editingNote.content && editingNote.content.trim().length > 0;
  
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 border-b border-border flex flex-wrap items-center justify-between">
      <div className={`flex ${isMobile ? 'flex-wrap gap-2' : 'gap-4'} items-center`}>
        <SummaryGenControls
          summaryLevel={summaryLevel}
          summarizing={summarizing}
          hasContent={hasContent}
          isMobile={isMobile}
          onSummaryLevelChange={onSummaryLevelChange}
          onGenerateSummary={onGenerateSummary}
        />

        <EnhanceDropdown
          enhancing={enhancing}
          hasContent={hasContent}
          isMobile={isMobile}
          onEnhanceNote={onEnhanceNote}
        />
      </div>

      {hasSummary && (
        <SummaryToggleButton
          showSummary={showSummary}
          isMobile={isMobile}
          onToggleSummary={onToggleSummary}
        />
      )}
    </div>
  );
};
