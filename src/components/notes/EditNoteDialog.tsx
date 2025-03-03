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
  onEnhanceNote: (enhanceType: 'grammar' | 'structure') => void;
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
  // Tags state removed
  const [tags, setTags] = useState<string[]>([]);

  // Handle word count calculation for HTML content
  useEffect(() => {
    if (editingNote?.content) {
      // Create a temporary element to strip HTML tags
      const tempElement = document.createElement('div');
      tempElement.innerHTML = editingNote.content;
      const textContent = tempElement.textContent || tempElement.innerText || '';
      const words = textContent.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [editingNote?.content]);

  // Setup tags from editing note
  useEffect(() => {
    if (editingNote?.tags) {
      setTags(editingNote.tags);
    } else {
      setTags([]);
    }
  }, [editingNote?.tags]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !editingNote) return;
    
    const autoSaveTimer = setTimeout(() => {
      onSave();
      setLastSaved(new Date());
    }, 60000); // Auto-save every 60 seconds
    
    return () => clearTimeout(autoSaveTimer);
  }, [editingNote, autoSaveEnabled, onSave]);

  // Handle keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && open) {
        e.preventDefault();
        onSave();
        setLastSaved(new Date());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onSave]);

  // Manual save function
  const handleSave = () => {
    onSave();
    setLastSaved(new Date());
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
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
        onNoteChange={onNoteChange}
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
