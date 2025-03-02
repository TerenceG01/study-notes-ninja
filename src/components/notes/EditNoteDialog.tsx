
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "@/hooks/notes/types";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteHeaderSection } from "./NoteHeaderSection";
import { TagsSection } from "./TagsSection";
import { SummaryControls } from "./SummaryControls";
import { NoteContentEditor } from "./NoteContentEditor";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNote: Note | null;
  editingNote: Note | null;
  showSummary: boolean;
  summaryLevel: SummaryLevel;
  summarizing: boolean;
  newTag: string;
  commonSubjects: string[];
  onNoteChange: (note: Note | null) => void;
  onSummaryLevelChange: (level: SummaryLevel) => void;
  onGenerateSummary: () => void;
  onToggleSummary: () => void;
  onNewTagChange: (tag: string) => void;
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
  newTag,
  commonSubjects,
  onNoteChange,
  onSummaryLevelChange,
  onGenerateSummary,
  onToggleSummary,
  onNewTagChange,
  onSave
}: EditNoteDialogProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Handle word count calculation
  useEffect(() => {
    if (editingNote?.content) {
      const words = editingNote.content.trim().split(/\s+/).filter(Boolean).length;
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

  const renderNoteContent = useCallback(() => {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <NoteHeaderSection 
          editingNote={editingNote}
          isFullscreen={isFullscreen}
          commonSubjects={commonSubjects}
          lastSaved={lastSaved}
          autoSaveEnabled={autoSaveEnabled}
          onNoteChange={onNoteChange}
          onToggleFullscreen={toggleFullscreen}
          onToggleAutoSave={toggleAutoSave}
        />

        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="space-y-4 pr-4">
            <TagsSection 
              tags={tags}
              newTag={newTag}
              onTagsChange={setTags}
              onNewTagChange={onNewTagChange}
              editingNote={editingNote}
              onNoteChange={onNoteChange}
            />

            <SummaryControls 
              summaryLevel={summaryLevel}
              summarizing={summarizing}
              hasSummary={!!editingNote?.summary}
              showSummary={showSummary}
              onSummaryLevelChange={onSummaryLevelChange}
              onGenerateSummary={onGenerateSummary}
              onToggleSummary={onToggleSummary}
            />

            <NoteContentEditor 
              editingNote={editingNote}
              showSummary={showSummary}
              isFullscreen={isFullscreen}
              wordCount={wordCount}
              autoSaveEnabled={autoSaveEnabled}
              lastSaved={lastSaved}
              onNoteChange={onNoteChange}
              onToggleAutoSave={toggleAutoSave}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 flex justify-end space-x-2 py-2 bg-background sticky bottom-0 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </div>
    );
  }, [
    editingNote, isFullscreen, commonSubjects, lastSaved, autoSaveEnabled,
    onNoteChange, newTag, onNewTagChange, tags, summaryLevel, summarizing,
    showSummary, onSummaryLevelChange, onGenerateSummary, onToggleSummary,
    wordCount, handleSave, onOpenChange, toggleAutoSave, toggleFullscreen
  ]);

  return (
    <>
      {isFullscreen ? (
        <Sheet open={open && isFullscreen} onOpenChange={(open) => {
          if (!open) {
            setIsFullscreen(false);
            onOpenChange(false);
          }
        }}>
          <SheetContent
            side="top"
            className="h-screen w-screen p-6 flex flex-col max-h-screen"
          >
            {renderNoteContent()}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open && !isFullscreen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
            {renderNoteContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
