
import { useState } from "react";
import { Note } from "@/hooks/useNotes";
import { EditNoteDialog } from "./EditNoteDialog";
import { useNoteSummary } from "@/hooks/useNoteSummary";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CommonSubjects } from "./CommonSubjects";

interface NoteEditingSectionProps {
  onNotesChanged: () => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  editingNote: Note | null;
  setEditingNote: (note: Note | null) => void;
}

export const NoteEditingSection = ({ 
  onNotesChanged, 
  selectedNote, 
  setSelectedNote, 
  editingNote, 
  setEditingNote 
}: NoteEditingSectionProps) => {
  const { toast } = useToast();
  const [enhancing, setEnhancing] = useState(false);
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
      // Show loading toast
      const loadingToastId = toast({
        title: "Generating summary...",
        description: "Our AI is analyzing your note to create a concise summary.",
      }).id;
      
      // When sending to summary, strip HTML content if it's HTML
      const contentToSummarize = typeof editingNote.content === 'string' && editingNote.content.includes('<') 
        ? new DOMParser().parseFromString(editingNote.content, 'text/html').body.textContent || editingNote.content
        : editingNote.content;
      
      const noteForSummary = { ...selectedNote, content: contentToSummarize };
      const summary = await generateSummary(noteForSummary);
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
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

  const handleEnhanceNote = async (enhanceType: 'grammar' | 'structure' | 'all') => {
    if (!editingNote) return;
    
    try {
      setEnhancing(true);
      
      // Show friendly loading toast with type-specific message
      const enhanceTypeText = enhanceType === 'grammar' ? 'grammar and spelling' : 
                             enhanceType === 'structure' ? 'structure and formatting' : 'content';
      
      const loadingToastId = toast({
        title: `Enhancing ${enhanceTypeText}...`,
        description: "Our AI assistant is polishing your note. This may take a few moments.",
      }).id;

      // Send the rich text content as is to preserve HTML formatting
      const contentToEnhance = editingNote.content;

      const { data, error } = await supabase.functions.invoke('enhance-note', {
        body: {
          content: contentToEnhance,
          title: editingNote.title,
          enhanceType
        },
      });

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      if (error) throw error;

      if (data.enhancedContent) {
        // Update the note with enhanced content, which should be properly formatted HTML
        setEditingNote({
          ...editingNote,
          content: data.enhancedContent
        });
        
        toast({
          title: "Note enhanced!",
          description: `Your note's ${enhanceTypeText} has been successfully improved.`,
        });
      }
    } catch (error) {
      console.error("Error enhancing note:", error);
      toast({
        variant: "destructive",
        title: "Enhancement failed",
        description: "Failed to enhance your note. Please try again later.",
      });
    } finally {
      setEnhancing(false);
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
          // Still send empty array for tags to maintain database compatibility
          tags: [],
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
      enhancing={enhancing}
      commonSubjects={CommonSubjects}
      onNoteChange={setEditingNote}
      onSummaryLevelChange={setSummaryLevel}
      onGenerateSummary={handleGenerateSummary}
      onToggleSummary={() => setShowSummary(!showSummary)}
      onEnhanceNote={handleEnhanceNote}
      onSave={updateNote}
    />
  );
};
