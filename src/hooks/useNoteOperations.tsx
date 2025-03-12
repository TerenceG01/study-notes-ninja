
import { useCallback } from "react";
import { Note } from "@/hooks/useNotes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useNoteOperations = (onNotesChanged: () => void) => {
  const { toast } = useToast();

  const updateNote = useCallback(async (editingNote: Note | null) => {
    if (!editingNote) return;

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: editingNote.title,
          content: editingNote.content,
          summary: editingNote.summary,
          subject: editingNote.subject,
        })
        .eq("id", editingNote.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note updated successfully!",
      });

      onNotesChanged();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Failed to update note. Please try again.",
      });
    }
  }, [onNotesChanged, toast]);

  return {
    updateNote
  };
};
