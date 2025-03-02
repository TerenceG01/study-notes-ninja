
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
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Hash className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1"
          >
            <span>{tag}</span>
            <button 
              onClick={() => removeTag(tag)}
              className="text-secondary-foreground/70 hover:text-secondary-foreground"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => onNewTagChange(e.target.value)}
          onKeyDown={handleTagKeyPress}
          placeholder="Add a tag"
          className="h-8 text-sm"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addTag}
          disabled={!newTag || tags.includes(newTag)}
        >
          Add
        </Button>
      </div>
    </div>
  );
};
