
import { useState } from "react";
import { Note } from "@/hooks/notes";
import { EditNoteDialog } from "./EditNoteDialog";
import { useNoteSummary } from "@/hooks/useNoteSummary";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CommonSubjects } from "./CommonSubjects";

interface NoteEditingSectionProps {
  onNotesChanged: () => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  editingNote: Note | null;
  setEditingNote: (note: Note | null) => void;
}

export const NoteEditingSection = ({ 
  onNotesChanged, 
  newTag, 
  setNewTag, 
  selectedNote, 
  setSelectedNote, 
  editingNote, 
  setEditingNote 
}: NoteEditingSectionProps) => {
  const { toast } = useToast();
  const {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    setShowSummary,
    generateSummary,
  } = useNoteSummary();

  const handleGenerateSummary = async () => {
    if (!selectedNote || !editingNote) return;
    
    try {
      const summary = await generateSummary(selectedNote);
      if (summary) {
        const updatedNote = { ...editingNote, summary };
        setEditingNote(updatedNote);
        setShowSummary(true);
        
        toast({
          title: "Summary generated",
          description: "Your note has been summarized successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Summary generation failed",
        description: "There was an error generating the summary.",
      });
    }
  };

  const updateNote = async () => {
    if (!editingNote) return;

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: editingNote.title,
          content: editingNote.content,
          summary: editingNote.summary,
          tags: editingNote.tags || [],
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
  };

  return (
    <EditNoteDialog
      open={!!selectedNote}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedNote(null);
          setEditingNote(null);
          setShowSummary(false);
        }
      }}
      selectedNote={selectedNote}
      editingNote={editingNote}
      showSummary={showSummary}
      summaryLevel={summaryLevel}
      summarizing={summarizing}
      newTag={newTag}
      commonSubjects={CommonSubjects}
      onNoteChange={setEditingNote}
      onSummaryLevelChange={setSummaryLevel}
      onGenerateSummary={handleGenerateSummary}
      onToggleSummary={() => setShowSummary(!showSummary)}
      onNewTagChange={setNewTag}
      onSave={updateNote}
    />
  );
};
