
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";

export const useNoteEditorSave = (
  newNote: {
    title: string;
    content: string;
    subject: string;
    summary?: string;
  },
  setIsSaved: (saved: boolean) => void,
  setLastSaved: (date: Date | null) => void,
  setChangesMade: (changed: boolean) => void,
  resetEditor: () => void,
  setIsEditorExpanded: (expanded: boolean) => void,
  setShowSummary: (show: boolean) => void
) => {
  const { user } = useAuth();
  const { createNote } = useNotes();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user) return false;
    const success = await createNote(newNote, user.id);
    if (success) {
      setIsSaved(true);
      setLastSaved(new Date());
      setChangesMade(false);
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
      setTimeout(() => {
        resetEditor();
        setIsEditorExpanded(false);
        setIsSaved(false);
        setShowSummary(false);
      }, 1000);
      return true;
    }
    return false;
  };

  return {
    handleSave,
  };
};
