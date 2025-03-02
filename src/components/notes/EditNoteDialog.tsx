
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hash, Loader2, Maximize2, Minimize2, Save, X, FileText, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "@/hooks/useNotes";

type SummaryLevel = 'brief' | 'medium' | 'detailed';
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

  const addTag = () => {
    if (!newTag || tags.includes(newTag)) return;
    
    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    
    if (editingNote) {
      onNoteChange({
        ...editingNote,
        tags: updatedTags
      });
    }
    
    onNewTagChange('');
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    
    if (editingNote) {
      onNoteChange({
        ...editingNote,
        tags: updatedTags
      });
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag) {
      e.preventDefault();
      addTag();
    }
  };

  // Manual save function
  const handleSave = () => {
    onSave();
    setLastSaved(new Date());
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isFullscreen ? 'fixed inset-0 max-w-full h-full rounded-none p-4 sm:p-6' : 'sm:max-w-[800px]'} 
          flex flex-col overflow-hidden transition-all duration-200`}
      >
        <div className="flex justify-between items-center">
          <DialogHeader className="flex-grow">
            <DialogTitle>
              <Input 
                value={editingNote?.title || ""} 
                onChange={e => onNoteChange(editingNote ? {
                  ...editingNote,
                  title: e.target.value
                } : null)} 
                className="text-xl font-semibold" 
                placeholder="Note Title"
              />
            </DialogTitle>
          </DialogHeader>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleFullscreen} 
            className="ml-2"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2">
            <Select 
              value={editingNote?.subject || "General"} 
              onValueChange={value => onNoteChange(editingNote ? {
                ...editingNote,
                subject: value
              } : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {commonSubjects.map(subject => (
                  <SelectItem key={subject} value={subject} className="hover:bg-muted cursor-pointer">
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex-shrink-0"
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
            >
              {autoSaveEnabled ? (
                <>
                  <Clock className="mr-1 h-3 w-3" />
                  Auto-save On
                </>
              ) : (
                <>
                  <X className="mr-1 h-3 w-3" />
                  Auto-save Off
                </>
              )}
            </Button>
            
            {lastSaved && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center mt-4">
          <Hash className="h-4 w-4 text-muted-foreground" />
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-destructive ml-1"
                aria-label={`Remove ${tag} tag`}
              >
                ×
              </button>
            </span>
          ))}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="w-32 h-8 text-sm"
            />
            <Button size="sm" variant="ghost" onClick={addTag} disabled={!newTag}>
              +
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center mt-4">
          <Select value={summaryLevel} onValueChange={onSummaryLevelChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Summary Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brief">Brief (30%)</SelectItem>
              <SelectItem value="medium">Medium (50%)</SelectItem>
              <SelectItem value="detailed">Detailed (70%)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={onGenerateSummary} disabled={summarizing} variant="secondary">
            {summarizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : 'Generate Summary'}
          </Button>

          {editingNote?.summary && (
            <Button variant="outline" onClick={onToggleSummary}>
              {showSummary ? 'Show Original' : 'Show Summary'}
            </Button>
          )}
        </div>

        <div className="relative flex-grow mt-4 min-h-[300px] flex flex-col overflow-hidden">
          {showSummary && editingNote?.summary ? (
            <Card className="p-4 bg-muted/50 h-full overflow-auto">
              <ScrollArea className="h-full pr-4">
                <div className="prose max-w-none">
                  {editingNote.summary.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          ) : (
            <div className="flex flex-col h-full">
              <Textarea 
                value={editingNote?.content || ""} 
                onChange={e => onNoteChange(editingNote ? {
                  ...editingNote,
                  content: e.target.value
                } : null)} 
                className="flex-grow resize-none min-h-[300px] h-full"
                placeholder="Write your notes here..."
              />
              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{wordCount} words</span>
                </div>
                <div>
                  Press Ctrl+S to save
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-end space-x-2 sticky bottom-0 pt-2 bg-background border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
