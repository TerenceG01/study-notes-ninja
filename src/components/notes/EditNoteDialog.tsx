
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
  const [tags, setTags] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [lectureMode, setLectureMode] = useState(false);

  // Update local fullscreen state when prop changes
  useEffect(() => {
    setLocalIsFullscreen(isFullscreen);
  }, [isFullscreen]);

  // Automatically use fullscreen on mobile
  useEffect(() => {
    if (isMobile && open) {
      setLocalIsFullscreen(true);
    }
  }, [isMobile, open]);

  // Handle word count calculation
  useEffect(() => {
    if (editingNote?.content) {
      const words = editingNote.content.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      
      // If content has changed since last save, set isSaved to false
      if (originalContent !== "" && originalContent !== editingNote.content) {
        setIsSaved(false);
      }
    } else {
      setWordCount(0);
    }
  }, [editingNote?.content, originalContent]);

  // Setup tags from editing note
  useEffect(() => {
    if (editingNote?.tags) {
      setTags(editingNote.tags);
    } else {
      setTags([]);
    }
  }, [editingNote?.tags]);
  
  // Store original content when note changes
  useEffect(() => {
    if (editingNote?.content) {
      setOriginalContent(editingNote.content);
    }
  }, [selectedNote]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !editingNote || lectureMode) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, isMobile ? 30000 : 60000); // Auto-save more frequently on mobile (30s vs 60s)
    
    return () => clearTimeout(autoSaveTimer);
  }, [editingNote, autoSaveEnabled, lectureMode]);

  // Handle keyboard shortcut for save
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

  // Manual save function
  const handleSave = () => {
    onSave();
    setLastSaved(new Date());
    setIsSaved(true);
    setOriginalContent(editingNote?.content || "");
  };

  const toggleFullscreen = () => {
    setLocalIsFullscreen(!localIsFullscreen);
  };

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };

  const toggleLectureMode = () => {
    // Auto-save before entering lecture mode
    if (!lectureMode && !isSaved) {
      handleSave();
    }
    setLectureMode(!lectureMode);
  };

  const handleNoteChange = (note: Note | null) => {
    onNoteChange(note);
    if (isSaved && note?.content !== originalContent) {
      setIsSaved(false);
    }
  };

  // If lecture mode is enabled, show the lecture mode component
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
        tags={tags}
        onTagsChange={setTags}
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
