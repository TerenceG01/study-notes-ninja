
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
    <div className="space-y-2 mx-[5px]">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className="bg-secondary/60 text-secondary-foreground px-3 py-1.5 rounded-full text-sm flex items-center gap-1 hover:bg-secondary transition-colors"
          >
            <Hash className="h-3 w-3 text-secondary-foreground/70" />
            <span>{tag}</span>
            <button 
              onClick={() => removeTag(tag)} 
              className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
              aria-label={`Remove ${tag} tag`}
            >
              ×
            </button>
          </div>
        ))}
        
        <div className="flex items-center h-8 mt-1">
          <div className="relative">
            <Hash className="h-3.5 w-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Add tag..."
              className="pl-8 h-9 text-sm w-[130px] focus-visible:ring-primary/40"
            />
          </div>
          <Button 
            onClick={addTag} 
            disabled={!newTag || tags.includes(newTag)}
            size="sm"
            variant="ghost"
            className="ml-1 h-9 px-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
