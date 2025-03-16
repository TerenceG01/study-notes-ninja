
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/hooks/useNotes";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useFullscreenState } from "@/hooks/useFullscreenState";
import { useNoteSummary, SummaryLevel } from "@/hooks/useNoteSummary";
import { useNoteEnhancement } from "@/hooks/useNoteEnhancement";
import { useToast } from "@/hooks/use-toast";

export const useNoteEditorState = () => {
  const { user } = useAuth();
  const { createNote } = useNotes();
  const { 
    isEditorExpanded, 
    setIsEditorExpanded, 
    newNote, 
    handleNoteChange,
    resetEditor
  } = useNoteEditor();
  const { toast } = useToast();
  const { isFullscreen, enableFullscreen, toggleFullscreen } = useFullscreenState();
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [lectureMode, setLectureMode] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  
  // AI Enhancement & Summary features
  const { enhancing, enhanceNote } = useNoteEnhancement();
  const {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    setShowSummary,
    generateSummary,
  } = useNoteSummary();

  const handleNoteContentChange = (content: string) => {
    handleNoteChange('content', content);
    
    if (content) {
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setChangesMade(true);
    } else {
      setWordCount(0);
    }
  };

  const handleSave = async () => {
    if (!user) return false;
    const success = await createNote(newNote, user.id);
    if (success) {
      setIsSaved(true);
      setLastSaved(new Date());
      setChangesMade(false);
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
      setTimeout(() => {
        resetEditor();
        setIsEditorExpanded(false);
        setIsSaved(false);
        setShowSummary(false);
      }, 1000);
      return true;
    }
    return false;
  };

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };

  const toggleLectureMode = () => {
    setLectureMode(!lectureMode);
  };
  
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
  
  const handleEnhanceNote = async (enhanceType: 'grammar' | 'structure' | 'all') => {
    try {
      // Show loading toast
      const loadingToastId = toast({
        title: "Enhancing note...",
        description: "Our AI is improving your note.",
      }).id;
      
      // Create a properly formatted Note object
      const fullNote = {
        id: 'new-note-temp-id',
        title: newNote.title,
        content: newNote.content,
        subject: newNote.subject || 'General',
        created_at: new Date().toISOString(),
        folder: 'My Notes'
      };
      
      await enhanceNote(fullNote, enhanceType, (enhancedNote) => {
        if (enhancedNote) {
          handleNoteChange('content', enhancedNote.content);
          
          // Dismiss loading toast
          toast.dismiss(loadingToastId);
          
          toast({
            title: "Note enhanced",
            description: "Your note has been improved successfully.",
          });
        }
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Enhancement failed",
        description: "There was an error enhancing your note.",
      });
    }
  };

  return {
    newNote,
    isEditorExpanded,
    setIsEditorExpanded,
    handleNoteChange,
    handleNoteContentChange,
    wordCount,
    lastSaved,
    autoSaveEnabled,
    isSaved,
    isFullscreen,
    lectureMode,
    summarizing,
    summaryLevel,
    showSummary,
    enhancing,
    changesMade,
    handleSave,
    toggleAutoSave,
    toggleLectureMode,
    toggleFullscreen,
    enableFullscreen,
    handleGenerateSummary,
    handleToggleSummary,
    setSummaryLevel,
    handleEnhanceNote,
  };
};
