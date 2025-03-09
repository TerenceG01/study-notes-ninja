
import { useCallback } from "react";
import { Note } from "@/hooks/useNotes";
import { useNoteSummary, SummaryLevel } from "@/hooks/useNoteSummary";
import { useToast } from "@/hooks/use-toast";

interface NoteSummaryHandlerProps {
  selectedNote: Note | null;
  editingNote: Note | null;
  setEditingNote: (note: Note | null) => void;
  setShowSummary: (show: boolean) => void;
}

export const NoteSummaryHandler = ({
  selectedNote,
  editingNote,
  setEditingNote,
  setShowSummary
}: NoteSummaryHandlerProps) => {
  const { toast } = useToast();
  
  const {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    setShowSummary: setShowSummaryFromHook,
    generateSummary,
  } = useNoteSummary();

  const handleGenerateSummary = useCallback(async () => {
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
  }, [editingNote, selectedNote, generateSummary, toast, setShowSummary, setEditingNote]);

  return {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    setShowSummary: setShowSummaryFromHook,
    handleGenerateSummary,
    toggleSummary: () => setShowSummary(!showSummary)
  };
};
