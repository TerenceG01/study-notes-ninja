
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteDialog } from "./dialog/NoteDialog";
import { Note } from "./types";

interface NewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newNote: {
    title: string;
    content: string;
    subject: string;
    summary?: string;
  };
  showSummary: boolean;
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  enhancing: boolean;
  commonSubjects: string[];
  onNoteChange: (field: string, value: string | string[]) => void;
  onNoteContentChange: (content: string) => void;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onEnhanceNote: (enhanceType: 'grammar' | 'structure' | 'all') => void;
  onSave: () => Promise<boolean>;
  isFullscreen?: boolean;
}

export const NewNoteDialog = ({
  open,
  onOpenChange,
  newNote,
  showSummary,
  summaryLevel,
  summarizing,
  enhancing,
  commonSubjects,
  onNoteChange,
  onNoteContentChange,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onEnhanceNote,
  onSave,
  isFullscreen = true
}: NewNoteDialogProps) => {
  // Format the note for consumption by the NoteDialog component
  const formattedNote: Note = {
    id: 'new-note-temp-id',
    title: newNote.title || '',
    content: newNote.content || '',
    subject: newNote.subject || 'General',
    created_at: new Date().toISOString(),
    folder: 'My Notes',
    summary: newNote.summary || ''
  };

  // Adapter function to convert between the different note change handlers
  const handleNoteChange = (note: Note | null) => {
    if (note) {
      if (note.title !== undefined) onNoteChange('title', note.title);
      if (note.content !== undefined) onNoteContentChange(note.content);
      if (note.subject !== undefined) onNoteChange('subject', note.subject);
      if (note.summary !== undefined) onNoteChange('summary', note.summary);
    }
  };

  return (
    <NoteDialog
      open={open}
      onOpenChange={onOpenChange}
      note={formattedNote}
      showSummary={showSummary}
      summaryLevel={summaryLevel}
      summarizing={summarizing}
      enhancing={enhancing}
      commonSubjects={commonSubjects}
      onNoteChange={handleNoteChange}
      onSummaryLevelChange={onSummaryLevelChange}
      onGenerateSummary={onGenerateSummary}
      onToggleSummary={onToggleSummary}
      onEnhanceNote={onEnhanceNote}
      onSave={onSave}
      isFullscreen={isFullscreen}
      saveDisabled={!newNote.content || newNote.content.trim().length === 0}
    />
  );
};
