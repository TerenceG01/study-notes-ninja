
import { useState, useEffect } from "react";
import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteContentContainer } from "./NoteContentContainer";
import { DialogFooterActions } from "./DialogFooterActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { DialogWrapper } from "./dialog/DialogWrapper";
import { LectureMode } from "./LectureMode";

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
  const isMobile = useIsMobile();
  const [localIsFullscreen, setLocalIsFullscreen] = useState(isFullscreen);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [lectureMode, setLectureMode] = useState(false);

  // Format the note for consumption by child components
  const formattedNote: Note = {
    id: 'new-note-temp-id',
    title: newNote.title || '',
    content: newNote.content || '',
    subject: newNote.subject || 'General',
    created_at: new Date().toISOString(),
    folder: 'My Notes',
    summary: newNote.summary || ''
  };

  useEffect(() => {
    setLocalIsFullscreen(isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    if (isMobile && open) {
      setLocalIsFullscreen(true);
    }
  }, [isMobile, open]);

  useEffect(() => {
    if (newNote.content && !lectureMode) {
      const words = newNote.content.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setChangesMade(true);
    } else {
      setWordCount(0);
    }
  }, [newNote.content, lectureMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && open && !lectureMode) {
        e.preventDefault();
        handleSave();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, lectureMode]);

  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      setLastSaved(new Date());
      setIsSaved(true);
      setChangesMade(false);
    }
    return success;
  };

  const toggleFullscreen = () => {
    setLocalIsFullscreen(!localIsFullscreen);
  };

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };

  const toggleLectureMode = () => {
    setLectureMode(!lectureMode);
  };

  const handleNoteChangeAdapter = (note: Note | null) => {
    if (note) {
      if (note.title !== undefined) onNoteChange('title', note.title);
      if (note.content !== undefined) onNoteContentChange(note.content);
      if (note.subject !== undefined) onNoteChange('subject', note.subject);
      if (note.summary !== undefined) onNoteChange('summary', note.summary);
    }
  };

  if (lectureMode && formattedNote) {
    return (
      <LectureMode 
        note={formattedNote} 
        onExit={toggleLectureMode}
      />
    );
  }

  return (
    <DialogWrapper 
      open={open} 
      onOpenChange={onOpenChange} 
      isFullscreen={localIsFullscreen}
    >
      <NoteContentContainer
        editingNote={formattedNote}
        isFullscreen={localIsFullscreen}
        showSummary={showSummary}
        summaryLevel={summaryLevel}
        summarizing={summarizing}
        enhancing={enhancing}
        commonSubjects={commonSubjects}
        wordCount={wordCount}
        lastSaved={lastSaved}
        autoSaveEnabled={autoSaveEnabled}
        onNoteChange={handleNoteChangeAdapter}
        onSummaryLevelChange={onSummaryLevelChange}
        onGenerateSummary={onGenerateSummary}
        onToggleSummary={onToggleSummary}
        onEnhanceNote={onEnhanceNote}
        onToggleFullscreen={toggleFullscreen}
        onToggleAutoSave={toggleAutoSave}
        onToggleLectureMode={toggleLectureMode}
      />
      <DialogFooterActions 
        onSave={handleSave} 
        onCancel={() => onOpenChange(false)}
        isSaved={isSaved}
        saveDisabled={!changesMade}
      />
    </DialogWrapper>
  );
};
