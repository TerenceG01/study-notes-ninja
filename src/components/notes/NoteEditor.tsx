
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, BookOpen, Tag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  note: {
    title: string;
    content: string;
    tags: string[];
    subject: string;
  };
  newTag: string;
  commonSubjects: string[];
  onNoteChange: (field: string, value: string | string[]) => void;
  onTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const NoteEditor = ({
  note,
  newTag,
  commonSubjects,
  onNoteChange,
  onTagChange,
  onAddTag,
  onRemoveTag,
  onCancel,
  onSave,
}: NoteEditorProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <Input
        placeholder="Note Title"
        value={note.title}
        onChange={(e) => onNoteChange('title', e.target.value)}
        className="text-lg font-medium"
      />

      <div className="space-y-1">
        <Label htmlFor="subject" className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          Subject
        </Label>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-full justify-between",
                note.subject && "text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>{note.subject || "Select a subject"}</span>
              </div>
              {note.subject && (
                <Badge variant="secondary" className="ml-2">
                  {note.subject}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0 max-h-[300px] overflow-y-auto">
            <div className="p-2 space-y-1">
              {commonSubjects.map((subject) => (
                <Button
                  key={subject}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left",
                    note.subject === subject && "bg-muted font-medium"
                  )}
                  onClick={() => onNoteChange('subject', subject)}
                >
                  {subject}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <p className="text-xs text-muted-foreground mt-1">
          Assigning a subject helps organize your notes and makes them easier to find
        </p>
      </div>

      <Textarea
        placeholder="Write your note here..."
        value={note.content}
        onChange={(e) => onNoteChange('content', e.target.value)}
        className="min-h-[200px] resize-y"
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Save Note
        </Button>
      </div>
    </div>
  );
};
