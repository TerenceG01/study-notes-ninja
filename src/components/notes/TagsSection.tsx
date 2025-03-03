
import { useState, useEffect } from "react";
import { Hash, Plus } from "lucide-react";
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
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Hash className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Tags</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:bg-secondary/80 transition-colors"
          >
            <span>{tag}</span>
            <button 
              onClick={() => removeTag(tag)} 
              className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-secondary-foreground/10"
              aria-label={`Remove ${tag} tag`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 items-center">
        <Input
          value={newTag}
          onChange={(e) => onNewTagChange(e.target.value)}
          onKeyDown={handleTagKeyPress}
          placeholder="Add a tag..."
          className="h-9 text-sm bg-background/50"
        />
        <Button 
          size="sm" 
          variant="outline" 
          onClick={addTag} 
          disabled={!newTag || tags.includes(newTag)}
          className="h-9"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};
