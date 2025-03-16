import { useState, useEffect } from "react";
import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteContentContainer } from "../container/NoteContentContainer";
import { DialogFooterActions } from "../DialogFooterActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { DialogWrapper } from "./DialogWrapper";
import { LectureMode } from "../LectureMode";

export interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
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
  onSave: () => Promise<boolean>;
  onSilentSave?: () => void;
  isFullscreen?: boolean;
  isSaved?: boolean;
  saveDisabled?: boolean;
  lastSaved?: Date | null;
  autoSaveEnabled?: boolean;
  onToggleAutoSave?: () => void;
}

export const NoteDialog = ({
  open,
  onOpenChange,
  note,
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
  isFullscreen = true,
  isSaved = false,
  saveDisabled = false,
  lastSaved: initialLastSaved = null,
  autoSaveEnabled: initialAutoSave = true,
  onToggleAutoSave
}: NoteDialogProps) => {
  const isMobile = useIsMobile();
  const [localIsFullscreen, setLocalIsFullscreen] = useState(isFullscreen);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(initialLastSaved);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(initialAutoSave);
  const [localIsSaved, setLocalIsSaved] = useState(isSaved);
  const [originalContent, setOriginalContent] = useState("");
  const [changesMade, setChangesMade] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lectureMode, setLectureMode] = useState(false);

  useEffect(() => {
    setLocalIsFullscreen(isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    if (isMobile && open) {
      setLocalIsFullscreen(true);
    }
  }, [isMobile, open]);

  useEffect(() => {
    setLocalIsSaved(isSaved);
  }, [isSaved]);

  useEffect(() => {
    if (note?.content && !lectureMode) {
      const words = note.content.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      
      if (originalContent !== "" && originalContent !== note.content) {
        setLocalIsSaved(false);
        setChangesMade(true);
      }
    } else {
      setWordCount(0);
    }
  }, [note?.content, originalContent, lectureMode]);
  
  useEffect(() => {
    if (note?.content) {
      setOriginalContent(note.content);
    }
  }, [note]);

  // Real-time auto-save implementation
  useEffect(() => {
    // Cancel any existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      setAutoSaveTimeout(null);
    }
    
    // If auto-save is enabled and there are changes, schedule a save
    if (autoSaveEnabled && changesMade && !lectureMode && note && onSilentSave) {
      const timeout = setTimeout(() => {
        handleSilentSave();
      }, 2000); // Save after 2 seconds of inactivity
      
      setAutoSaveTimeout(timeout);
    }
    
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [changesMade, note, autoSaveEnabled, lectureMode]);

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
      setLocalIsSaved(true);
      setChangesMade(false);
      if (note) {
        setOriginalContent(note.content || "");
      }
    }
    return success;
  };
  
  const handleSilentSave = () => {
    if (onSilentSave && changesMade) {
      onSilentSave();
      setLastSaved(new Date());
      setChangesMade(false);
      if (note) {
        setOriginalContent(note.content || "");
      }
    }
  };

  const toggleFullscreen = () => {
    setLocalIsFullscreen(!localIsFullscreen);
  };

  const toggleAutoSave = () => {
    const newValue = !autoSaveEnabled;
    setAutoSaveEnabled(newValue);
    
    // Call parent handler if provided
    if (onToggleAutoSave) {
      onToggleAutoSave();
    }
    
    // If enabling auto-save and there are unsaved changes, save immediately
    if (!autoSaveEnabled && changesMade && onSilentSave) {
      handleSilentSave();
    }
  };

  const toggleLectureMode = () => {
    if (!lectureMode && !localIsSaved && originalContent !== note?.content) {
      handleSave();
    }
    setLectureMode(!lectureMode);
  };

  const handleNoteChangeAdapter = (updatedNote: Note | null) => {
    onNoteChange(updatedNote);
    if (localIsSaved && updatedNote && note) {
      if (updatedNote.content !== originalContent) {
        setLocalIsSaved(false);
        setChangesMade(true);
      }
    }
  };

  if (lectureMode && note) {
    return (
      <LectureMode 
        note={note} 
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
        editingNote={note}
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
        isSaved={localIsSaved}
        saveDisabled={saveDisabled}
      />
    </DialogWrapper>
  );
};
