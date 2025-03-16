
import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteDialog } from "./dialog/NoteDialog";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNote: Note | null;
  editingNote: Note | null;
  showSummary: boolean;
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  enhancing: boolean;
  commonSubjects: string[];
  onNoteChange: (note: Note | null) => void;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
  onSave: () => void;
  onSilentSave?: () => void;
  isFullscreen?: boolean;
}

export const EditNoteDialog = ({
  open,
  onOpenChange,
  selectedNote,
  editingNote,
  showSummary,
  summaryLevel,
  summarizing,
  enhancing,
  commonSubjects,
  onNoteChange,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onEnhanceNote,
  onSave,
  onSilentSave,
  isFullscreen = true
}: EditNoteDialogProps) => {
  // We wrap the onSave function to match the expected Promise<boolean> return type
  const handleSave = async () => {
    onSave();
    return true;
  };

  if (!editingNote) return null;

  return (
    <NoteDialog
      open={open}
      onOpenChange={onOpenChange}
      note={editingNote}
      showSummary={showSummary}
      summaryLevel={summaryLevel}
      summarizing={summarizing}
      enhancing={enhancing}
      commonSubjects={commonSubjects}
      onNoteChange={onNoteChange}
      onSummaryLevelChange={onSummaryLevelChange}
      onGenerateSummary={onGenerateSummary}
      onToggleSummary={onToggleSummary}
      onEnhanceNote={onEnhanceNote}
      onSave={handleSave}
      onSilentSave={onSilentSave}
      isFullscreen={isFullscreen}
    />
  );
};
