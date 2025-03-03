
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
  // Tags functionality has been removed
  return null;
};
