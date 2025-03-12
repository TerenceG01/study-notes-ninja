import { useState, useEffect } from "react";
import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteContentContainer } from "./NoteContentContainer";
import { DialogFooterActions } from "./DialogFooterActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { DialogWrapper } from "./dialog/DialogWrapper";
import { LectureMode } from "./LectureMode";

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
  isFullscreen = true
}: EditNoteDialogProps) => {
  const isMobile = useIsMobile();
  const [localIsFullscreen, setLocalIsFullscreen] = useState(isFullscreen);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [originalSubject, setOriginalSubject] = useState("");
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
    if (editingNote?.content && !lectureMode) {
      const words = editingNote.content.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      
      if (originalContent !== "" && originalContent !== editingNote.content) {
        setIsSaved(false);
      }
    } else {
      setWordCount(0);
    }
  }, [editingNote?.content, originalContent, lectureMode]);
  
  useEffect(() => {
    if (editingNote) {
      if (editingNote.content) {
        setOriginalContent(editingNote.content);
      }
      setOriginalSubject(editingNote.subject || "");
    }
  }, [selectedNote, editingNote]);

  useEffect(() => {
    if (editingNote?.subject !== undefined && originalSubject !== "" && originalSubject !== editingNote.subject) {
      setIsSaved(false);
    }
  }, [editingNote?.subject, originalSubject]);

  useEffect(() => {
    if (!autoSaveEnabled || !editingNote || lectureMode) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, isMobile ? 30000 : 60000);
    
    return () => clearTimeout(autoSaveTimer);
  }, [editingNote, autoSaveEnabled, lectureMode]);

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

  const handleSave = () => {
    onSave();
    setLastSaved(new Date());
    setIsSaved(true);
    if (editingNote) {
      setOriginalContent(editingNote.content || "");
      setOriginalSubject(editingNote.subject || "");
    }
  };

  const toggleFullscreen = () => {
    setLocalIsFullscreen(!localIsFullscreen);
  };

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };

  const toggleLectureMode = () => {
    if (!lectureMode && !isSaved && originalContent !== editingNote?.content) {
      handleSave();
    }
    setLectureMode(!lectureMode);
  };

  const handleNoteChange = (note: Note | null) => {
    onNoteChange(note);
    if (isSaved && note) {
      if (note.content !== originalContent || (note.subject !== originalSubject)) {
        setIsSaved(false);
      }
    }
  };

  if (lectureMode && editingNote) {
    return (
      <LectureMode 
        note={editingNote} 
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
        editingNote={editingNote}
        isFullscreen={localIsFullscreen}
        showSummary={showSummary}
        summaryLevel={summaryLevel}
        summarizing={summarizing}
        enhancing={enhancing}
        commonSubjects={commonSubjects}
        wordCount={wordCount}
        lastSaved={lastSaved}
        autoSaveEnabled={autoSaveEnabled}
        onNoteChange={handleNoteChange}
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
      />
    </DialogWrapper>
  );
};
