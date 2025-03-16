
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNoteSummary, SummaryLevel } from "@/hooks/useNoteSummary";

export const useNoteEditorSummary = (newNote: {
  title: string;
  content: string;
  subject: string;
  summary?: string;
}, handleNoteChange: (field: string, value: string | string[]) => void) => {
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
    if (!newNote) return;
    
    try {
      // Show loading toast
      const loadingToastId = toast({
        title: "Generating summary...",
        description: "Our AI is analyzing your note to create a concise summary.",
      }).id;
      
      // When sending to summary, strip HTML content if it's HTML
      const contentToSummarize = typeof newNote.content === 'string' && newNote.content.includes('<') 
        ? new DOMParser().parseFromString(newNote.content, 'text/html').body.textContent || newNote.content
        : newNote.content;
      
      // Create a properly formatted Note object with all required properties
      const noteForSummary = { 
        id: 'new-note-temp-id',
        title: newNote.title,
        content: contentToSummarize,
        subject: newNote.subject || 'General',
        created_at: new Date().toISOString(),
        folder: 'My Notes',
        summary: newNote.summary
      };
      
      const summary = await generateSummary(noteForSummary);
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      if (summary) {
        handleNoteChange('summary', summary);
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

  const handleToggleSummary = () => {
    setShowSummary(!showSummary);
  };

  return {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    handleGenerateSummary,
    handleToggleSummary,
  };
};
