
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, BookOpen, Tag, Hash, X } from "lucide-react";
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
        <Label htmlFor="subject" className="flex items-center gap-1.5 text-sm">
          <BookOpen className="h-4 w-4" />
          Subject
        </Label>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-full justify-between h-9 px-3",
                note.subject ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Tag className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{note.subject || "Select a subject"}</span>
              </div>
              {note.subject && (
                <Badge variant="secondary" className="ml-2 truncate max-w-[120px]">
                  {note.subject}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-[300px] p-0 max-h-[300px] overflow-y-auto" align="start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 p-1">
              {commonSubjects.map((subject) => (
                <Button
                  key={subject}
                  variant="ghost"
                  className={cn(
                    "justify-start text-left h-8 text-sm",
                    note.subject === subject && "bg-muted font-medium"
                  )}
                  onClick={() => onNoteChange('subject', subject)}
                >
                  <span className="truncate">{subject}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <p className="text-xs text-muted-foreground mt-1">
          Assigning a subject helps organize your notes and makes them easier to find
        </p>
      </div>

      {/* Tags section */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-sm">
          <Hash className="h-4 w-4" />
          Tags
        </Label>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {note.tags.map((tag) => (
            <Badge 
              key={tag}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                onClick={() => onRemoveTag(tag)}
                className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground rounded-full"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove tag</span>
              </Button>
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTag.trim()) {
                e.preventDefault();
                onAddTag();
              }
            }}
          />
          <Button
            type="button"
            onClick={onAddTag}
            disabled={!newTag.trim()}
            size="sm"
            className="flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
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
