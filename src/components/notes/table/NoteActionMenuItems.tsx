
import React from "react";
import { Loader2, Share, Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/hooks/useNotes";

interface NoteActionMenuItemsProps {
  note: Note;
  onShareNote: (note: Note) => void;
  onNotesChanged: () => void;
  updatingNoteId: string | null;
}

export const NoteActionMenuItems: React.FC<NoteActionMenuItemsProps> = ({
  note,
  onShareNote,
  onNotesChanged,
  updatingNoteId,
}) => {
  const { toast } = useToast();

  const handleRemoveNote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!navigator.onLine) {
      toast({
        variant: "destructive",
        title: "You're offline",
        description: "Please connect to the internet to remove notes.",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id);

      if (error) throw error;

      onNotesChanged();
      
      toast({
        title: "Success",
        description: `Removed note "${note.title}"`,
      });
    } catch (error) {
      console.error("Error removing note:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to remove note. Please try again.",
      });
    }
  };

  return (
    <>
      <DropdownMenuItem 
        onClick={(e) => {
          e.stopPropagation();
          onShareNote(note);
        }}
        disabled={updatingNoteId === note.id}
      >
        {updatingNoteId === note.id ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sharing...
          </>
        ) : (
          <>
            <Share className="h-4 w-4 mr-2" />
            Share Note
          </>
        )}
      </DropdownMenuItem>
      <DropdownMenuItem 
        className="text-destructive"
        onClick={handleRemoveNote}
        disabled={updatingNoteId === note.id}
      >
        {updatingNoteId === note.id ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Removing...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Note
          </>
        )}
      </DropdownMenuItem>
    </>
  );
};
