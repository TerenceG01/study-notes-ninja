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
  return;
};