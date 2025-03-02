
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/hooks/notes/types";
import { SUBJECT_COLORS } from "./constants/colors";

interface NoteColorPickerProps {
  note: Note;
  onNotesChanged: () => void;
  updatingNoteId: string | null;
}

export const NoteColorPicker: React.FC<NoteColorPickerProps> = ({
  note,
  onNotesChanged,
  updatingNoteId,
}) => {
  const { toast } = useToast();

  const handleColorChange = async (e: React.MouseEvent, noteId: string, color: string) => {
    e.stopPropagation();
    
    if (!navigator.onLine) {
      toast({
        variant: "destructive",
        title: "You're offline",
        description: "Color changes will be applied when you're back online.",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          subject_color: color,
        })
        .eq('id', noteId);

      if (error) throw error;

      onNotesChanged();
      
      toast({
        title: "Success",
        description: `Updated color for ${note.subject || 'note'}`,
      });
    } catch (error) {
      console.error("Error updating color:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to update note color. Please try again.",
      });
    }
  };

  return (
    <>
      <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
        Subject Color
      </div>
      <div className="grid grid-cols-5 gap-1 p-2">
        {SUBJECT_COLORS.map((color) => (
          <Button
            key={color.value}
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0 rounded-full",
              color.class
            )}
            onClick={(e) => handleColorChange(e, note.id, color.value)}
            disabled={updatingNoteId === note.id}
          />
        ))}
      </div>
    </>
  );
};
