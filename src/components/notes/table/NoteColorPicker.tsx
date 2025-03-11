
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/components/notes/types";
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
  const [customColor, setCustomColor] = useState(note.custom_color || "#6366f1");
  const [showCustomColorInput, setShowCustomColorInput] = useState(note.subject_color === "custom");

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
      const updateData: { subject_color: string; custom_color?: string } = {
        subject_color: color,
      };
      
      // If selecting custom color, include the custom color value
      if (color === "custom") {
        updateData.custom_color = customColor;
        setShowCustomColorInput(true);
      } else {
        setShowCustomColorInput(false);
      }

      const { error } = await supabase
        .from('notes')
        .update(updateData)
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

  const handleCustomColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    
    if (note.subject_color === "custom") {
      try {
        const { error } = await supabase
          .from('notes')
          .update({
            custom_color: newColor,
          })
          .eq('id', note.id);

        if (error) throw error;

        onNotesChanged();
      } catch (error) {
        console.error("Error updating custom color:", error);
      }
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
              color.class,
              note.subject_color === color.value && "ring-2 ring-ring ring-offset-1"
            )}
            onClick={(e) => handleColorChange(e, note.id, color.value)}
            disabled={updatingNoteId === note.id}
          />
        ))}
      </div>
      
      {showCustomColorInput && (
        <div className="p-2 pt-0">
          <div className="flex items-center space-x-2">
            <div 
              className="h-6 w-6 rounded-full" 
              style={{ backgroundColor: customColor }}
            />
            <Input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="h-6 w-full p-0 border-none"
            />
          </div>
        </div>
      )}
    </>
  );
};
