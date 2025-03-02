
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hash, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Note } from "@/hooks/useNotes";
import { useState } from "react";

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`sm:max-w-[800px] ${isExpanded ? 'fixed inset-4 h-auto max-w-none transform-none rounded-lg' : ''}`}
      >
        <div className="flex flex-col h-full">
          <DialogHeader className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0" 
              onClick={toggleExpand}
            >
              {isExpanded ? <Minimize2 /> : <Maximize2 />}
            </Button>
            <DialogTitle>
              <Input 
                value={editingNote?.title || ""} 
                onChange={e => onNoteChange(editingNote ? {
                  ...editingNote,
                  title: e.target.value
                } : null)} 
                className="text-xl font-semibold" 
              />
            </DialogTitle>
          </DialogHeader>

          <div className="flex-grow overflow-auto flex flex-col">
            <div className="mt-4">
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
                  {commonSubjects.map(subject => 
                    <SelectItem 
                      key={subject} 
                      value={subject} 
                      className="hover:bg-muted cursor-pointer"
                    >
                      {subject}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 items-center mt-4 flex-wrap">
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
                {summarizing ? 
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                  </> : 'Generate Summary'
                }
              </Button>

              {editingNote?.summary && 
                <Button variant="outline" onClick={onToggleSummary}>
                  {showSummary ? 'Show Original' : 'Show Summary'}
                </Button>
              }
            </div>

            <div className={`mt-4 flex-grow overflow-auto ${isExpanded ? 'mb-20' : ''}`}>
              {showSummary && editingNote?.summary ? 
                <Card className="p-4 bg-muted/50 overflow-auto">
                  <div className="prose max-w-none">
                    {editingNote.summary.split('\n').map((line, index) => 
                      <p key={index} className="mb-2">{line}</p>
                    )}
                  </div>
                </Card> : 
                <Textarea 
                  value={editingNote?.content || ""} 
                  onChange={e => onNoteChange(editingNote ? {
                    ...editingNote,
                    content: e.target.value
                  } : null)} 
                  className="resize-none"
                  style={{ 
                    height: isExpanded ? 'calc(100vh - 300px)' : '300px',
                    minHeight: isExpanded ? '200px' : '300px' 
                  }}
                />
              }
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2 mt-4 sticky bottom-0 bg-background pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
