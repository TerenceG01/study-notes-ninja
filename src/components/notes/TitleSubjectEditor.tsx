
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Note } from "@/hooks/useNotes";
import { useState, useEffect } from "react";

interface TitleSubjectEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNote: Note | null;
  commonSubjects: string[];
  onNoteChange: (note: Note | null) => void;
}

export const TitleSubjectEditor = ({
  open,
  onOpenChange,
  editingNote,
  commonSubjects,
  onNoteChange
}: TitleSubjectEditorProps) => {
  const [localTitle, setLocalTitle] = useState("");
  const [localSubject, setLocalSubject] = useState("General");
  
  // Update local state when editing note changes
  useEffect(() => {
    if (editingNote) {
      setLocalTitle(editingNote.title || "");
      setLocalSubject(editingNote.subject || "General");
    }
  }, [editingNote, open]);
  
  const handleSave = () => {
    if (editingNote) {
      onNoteChange({
        ...editingNote,
        title: localTitle,
        subject: localSubject
      });
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] p-4">
        <DialogHeader>
          <DialogTitle className="text-base font-medium mb-3">Edit Note Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              placeholder="Note Title"
              className="h-9"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Select
              value={localSubject}
              onValueChange={setLocalSubject}
            >
              <SelectTrigger className="h-9">
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
          
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave}>
              Save Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
