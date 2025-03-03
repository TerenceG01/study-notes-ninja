
import { Hash } from "lucide-react";
import { Note } from "@/hooks/useNotes";

interface TagsSectionProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  editingNote: Note | null;
  onNoteChange: (note: Note | null) => void;
}

export const TagsSection = ({
  tags,
  onTagsChange,
  editingNote,
  onNoteChange
}: TagsSectionProps) => {
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
            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs flex items-center gap-1"
          >
            <span>{tag}</span>
            <button 
              onClick={() => removeTag(tag)} 
              className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center"
              aria-label={`Remove ${tag} tag`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
