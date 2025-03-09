
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Note } from "@/hooks/useNotes";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteContentContainer } from "./NoteContentContainer";
import { DialogFooterActions } from "./DialogFooterActions";

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
  onSave
}: EditNoteDialogProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [originalContent, setOriginalContent] = useState("");

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
    if (!autoSaveEnabled || !editingNote) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 60000); // Auto-save every 60 seconds
    
    return () => clearTimeout(autoSaveTimer);
  }, [editingNote, autoSaveEnabled]);

  // Handle keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && open) {
        e.preventDefault();
        handleSave();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Manual save function
  const handleSave = () => {
    onSave();
    setLastSaved(new Date());
    setIsSaved(true);
    setOriginalContent(editingNote?.content || "");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };

  const handleNoteChange = (note: Note | null) => {
    onNoteChange(note);
    if (isSaved && note?.content !== originalContent) {
      setIsSaved(false);
    }
  };

  const renderDialogContent = () => (
    <>
      <NoteContentContainer
        editingNote={editingNote}
        isFullscreen={isFullscreen}
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
      />
      <DialogFooterActions 
        onSave={handleSave} 
        onCancel={() => onOpenChange(false)}
        isSaved={isSaved}
      />
    </>
  );

  return (
    <>
      {isFullscreen ? (
        <Sheet 
          open={open && isFullscreen} 
          onOpenChange={(open) => {
            if (!open) {
              setIsFullscreen(false);
              onOpenChange(false);
            }
          }}
        >
          <SheetContent
            side="top"
            className="h-screen w-screen p-6 flex flex-col max-h-screen overflow-hidden bg-background"
          >
            {renderDialogContent()}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open && !isFullscreen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-6 overflow-hidden bg-background">
            {renderDialogContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
