
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hash, Plus } from "lucide-react";

interface NoteEditorProps {
  note: {
    title: string;
    content: string;
    tags: string[];
    subject: string;
    subject_color?: string;
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

const SUBJECT_COLORS = [
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Purple', value: 'purple' },
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
];

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

      <div className="flex gap-4">
        <Select
          value={note.subject}
          onValueChange={(value) => onNoteChange('subject', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {commonSubjects.map((subject) => (
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

        <Select
          value={note.subject_color || 'blue'}
          onValueChange={(value) => onNoteChange('subject_color', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Subject color" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECT_COLORS.map((color) => (
              <SelectItem 
                key={color.value} 
                value={color.value}
                className="flex items-center gap-2"
              >
                <div className={`w-4 h-4 rounded-full bg-${color.value}-500`} />
                {color.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Textarea
        placeholder="Write your note here..."
        value={note.content}
        onChange={(e) => onNoteChange('content', e.target.value)}
        className="min-h-[200px] resize-y"
      />

      <div className="flex flex-wrap gap-2 items-center">
        <Hash className="h-4 w-4 text-muted-foreground" />
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-1 hover:bg-secondary/80 transition-colors"
          >
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="hover:text-destructive ml-1"
              aria-label={`Remove ${tag} tag`}
            >
              ×
            </button>
          </span>
        ))}
        <Input
          placeholder="Add tag..."
          value={newTag}
          onChange={(e) => onTagChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && newTag) {
              onAddTag();
            }
          }}
          className="!mt-0 w-32 h-8 text-sm"
        />
      </div>

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
