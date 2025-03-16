
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SummaryLevel } from "@/hooks/useNoteSummary";
import { NoteDialog } from "./dialog/NoteDialog";
import { Note } from "./types";
import { useNoteEditorState } from "@/hooks/useNoteEditorState";
import { useToast } from "@/components/ui/use-toast";
import { CommonSubjects } from "./CommonSubjects";

interface NewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewNoteDialog = ({ open, onOpenChange }: NewNoteDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    newNote,
    handleNoteChange,
    handleNoteContentChange,
    handleSave,
    handleGenerateSummary,
    handleToggleSummary,
    setSummaryLevel,
    handleEnhanceNote,
    summaryLevel,
    showSummary,
    summarizing,
    enhancing,
    lastSaved,
    autoSaveEnabled,
    toggleAutoSave,
    setIsEditorExpanded,
  } = useNoteEditorState();

  // Convert the newNote object to a proper Note object for the NoteDialog
  const noteObject: Note = {
    id: 'new-note-temp-id',
    title: newNote.title,
    content: newNote.content,
    subject: newNote.subject || 'General',
    created_at: new Date().toISOString(),
    folder: 'My Notes',
    summary: newNote.summary
  };

  const handleDialogOpenChange = (openState: boolean) => {
    onOpenChange(openState);
    if (!openState) {
      setIsEditorExpanded(false);
    }
  };

  // Handle note changes
  const handleNoteChangeAdapter = (note: Note | null) => {
    if (note) {
      handleNoteChange('title', note.title);
      // Only update content through content-specific handler
      if (note.content !== newNote.content) {
        handleNoteContentChange(note.content);
      }
      handleNoteChange('subject', note.subject || 'General');
      if (note.summary !== undefined) {
        handleNoteChange('summary', note.summary);
      }
    }
  };

  // Check if user is authenticated
  useEffect(() => {
    if (open && !user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to be logged in to create notes.",
      });
      onOpenChange(false);
    }
  }, [open, user, toast, onOpenChange]);

  return (
    <NoteDialog
      open={open}
      onOpenChange={handleDialogOpenChange}
      note={noteObject}
      showSummary={showSummary}
      summaryLevel={summaryLevel}
      summarizing={summarizing}
      enhancing={enhancing}
      commonSubjects={CommonSubjects}
      onNoteChange={handleNoteChangeAdapter}
      onSummaryLevelChange={setSummaryLevel}
      onGenerateSummary={handleGenerateSummary}
      onToggleSummary={handleToggleSummary}
      onEnhanceNote={handleEnhanceNote}
      onSave={handleSave}
      isFullscreen={true}
      lastSaved={lastSaved}
      autoSaveEnabled={autoSaveEnabled}
      onToggleAutoSave={toggleAutoSave}
    />
  );
};
