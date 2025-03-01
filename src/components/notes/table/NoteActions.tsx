
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MoreVertical, Share, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/hooks/useNotes";

interface NoteActionsProps {
  note: Note;
  onShareNote: (note: Note) => void;
  onNotesChanged: () => void;
  updatingNoteId: string | null;
  sharingSubject: string | null;
}

export const SUBJECT_COLORS = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { name: 'Green', value: 'green', class: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { name: 'Red', value: 'red', class: 'bg-red-50 text-red-600 hover:bg-red-100' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
];

export const NoteActions: React.FC<NoteActionsProps> = ({
  note,
  onShareNote,
  onNotesChanged,
  updatingNoteId,
  sharingSubject,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking dropdown
          disabled={updatingNoteId === note.id || sharingSubject === note.subject}
        >
          {updatingNoteId === note.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side="top" 
        sideOffset={5}
        className="w-48"
      >
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
        <DropdownMenuSeparator />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
