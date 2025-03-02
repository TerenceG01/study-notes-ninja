
import { useState, useEffect } from "react";
import { Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Note } from "@/hooks/useNotes";

interface TagsSectionProps {
  tags: string[];
  newTag: string;
  onTagsChange: (tags: string[]) => void;
  onNewTagChange: (tag: string) => void;
  editingNote: Note | null;
  onNoteChange: (note: Note | null) => void;
}

export const TagsSection = ({
  tags,
  newTag,
  onTagsChange,
  onNewTagChange,
  editingNote,
  onNoteChange
}: TagsSectionProps) => {
  const addTag = () => {
    if (!newTag || tags.includes(newTag)) return;
    
    const updatedTags = [...tags, newTag];
    onTagsChange(updatedTags);
    
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
    onTagsChange(updatedTags);
    
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

  return (
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
  );
};
