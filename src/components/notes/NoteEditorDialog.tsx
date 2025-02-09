
import { useState } from "react";
import { Note } from "@/types/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SummaryLevel = 'brief' | 'medium' | 'detailed';

type NoteEditorDialogProps = {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteUpdated: () => void;
};

export const NoteEditorDialog = ({ note, open, onOpenChange, onNoteUpdated }: NoteEditorDialogProps) => {
  const { toast } = useToast();
  const [editingNote, setEditingNote] = useState<Note | null>(note);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>('medium');
  const [showSummary, setShowSummary] = useState(false);

  const updateNote = async () => {
    if (!editingNote || !editingNote.title || !editingNote.content) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in both title and content.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: editingNote.title,
          content: editingNote.content,
          summary: editingNote.summary,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingNote.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note updated successfully!",
      });

      onNoteUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Failed to update note. Please try again.",
      });
    }
  };

  const generateSummary = async () => {
    if (!editingNote) return;

    setSummarizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('summarize-note', {
        body: {
          content: editingNote.content,
          level: summaryLevel,
        },
      });

      if (error) {
        throw error;
      }

      if (data) {
        setEditingNote({
          ...editingNote,
          summary: data.summary,
        });
        setShowSummary(true);

        toast({
          title: "Summary generated",
          description: "Your note has been summarized successfully!",
        });
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: "destructive",
        title: "Error generating summary",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            <Input
              value={editingNote?.title || ""}
              onChange={(e) =>
                setEditingNote(editingNote ? { ...editingNote, title: e.target.value } : null)
              }
              className="mt-2"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 items-center mt-4">
          <Select
            value={summaryLevel}
            onValueChange={(value: SummaryLevel) => setSummaryLevel(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Summary Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brief">Brief (30%)</SelectItem>
              <SelectItem value="medium">Medium (50%)</SelectItem>
              <SelectItem value="detailed">Detailed (70%)</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={generateSummary} disabled={summarizing} variant="secondary">
            {summarizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>

          {editingNote?.summary && (
            <Button variant="outline" onClick={() => setShowSummary(!showSummary)}>
              {showSummary ? 'Show Original' : 'Show Summary'}
            </Button>
          )}
        </div>

        <div className="mt-4">
          {showSummary && editingNote?.summary ? (
            <Card className="p-4 bg-muted/50">
              <div className="prose max-w-none">
                {editingNote.summary.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </Card>
          ) : (
            <Textarea
              value={editingNote?.content || ""}
              onChange={(e) =>
                setEditingNote(editingNote ? { ...editingNote, content: e.target.value } : null)
              }
              className="min-h-[300px]"
            />
          )}
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={updateNote}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
