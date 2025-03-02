
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hash, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  console.log("EditNoteDialog rendering, open:", open, "selectedNote:", selectedNote?.title);
  const [expanded, setExpanded] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState("300px");

  // Adjust textarea height based on screen size
  useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      if (windowHeight < 600) {
        setTextareaHeight("150px");
      } else if (windowHeight < 900) {
        setTextareaHeight("250px");
      } else {
        setTextareaHeight("300px");
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${expanded ? 'fixed inset-2 h-[calc(100vh-16px)] max-h-none max-w-none m-0 rounded-lg flex flex-col' : 'sm:max-w-[800px] max-h-[90vh]'} overflow-y-auto`}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex-1">
            <Input 
              value={editingNote?.title || ""} 
              onChange={e => onNoteChange(editingNote ? {
                ...editingNote,
                title: e.target.value
              } : null)} 
              className="text-lg sm:text-xl font-semibold" 
              placeholder="Note title"
            />
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleExpand} 
            className="ml-2"
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </DialogHeader>

        <div className="mt-2 sm:mt-4">
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
                <SelectItem 
                  key={subject} 
                  value={subject} 
                  className="hover:bg-muted cursor-pointer"
                >
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center mt-2 sm:mt-4">
          <Select 
            value={summaryLevel} 
            onValueChange={onSummaryLevelChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Summary Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brief">Brief (30%)</SelectItem>
              <SelectItem value="medium">Medium (50%)</SelectItem>
              <SelectItem value="detailed">Detailed (70%)</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={onGenerateSummary} 
              disabled={summarizing} 
              variant="secondary"
              className="flex-1 sm:flex-none"
            >
              {summarizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : 'Generate Summary'}
            </Button>

            {editingNote?.summary && (
              <Button 
                variant="outline" 
                onClick={onToggleSummary}
                className="flex-1 sm:flex-none"
              >
                {showSummary ? 'Show Original' : 'Show Summary'}
              </Button>
            )}
          </div>
        </div>

        <div className={`mt-2 sm:mt-4 ${expanded ? 'flex-1 min-h-0' : ''}`}>
          {showSummary && editingNote?.summary ? (
            <Card className="p-4 bg-muted/50 overflow-y-auto h-full">
              <div className="prose max-w-none">
                {editingNote.summary.split('\n').map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            </Card>
          ) : (
            <Textarea 
              value={editingNote?.content || ""} 
              onChange={e => onNoteChange(editingNote ? {
                ...editingNote,
                content: e.target.value
              } : null)} 
              className={`resize-y ${expanded ? 'h-full' : `min-h-[${textareaHeight}]`}`}
              placeholder="Write your note content here..."
            />
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 mt-2 sm:mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
