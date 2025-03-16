
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useNoteEditorUI } from "@/hooks/useNoteEditorUI";
import { useNoteEditorContent } from "@/hooks/useNoteEditorContent";
import { useNoteEditorSave } from "@/hooks/useNoteEditorSave";
import { useNoteEditorSummary } from "@/hooks/useNoteEditorSummary";
import { useNoteEditorEnhancement } from "@/hooks/useNoteEditorEnhancement";

export const useNoteEditorState = () => {
  const { 
    isEditorExpanded, 
    setIsEditorExpanded, 
    newNote, 
    handleNoteChange,
    resetEditor
  } = useNoteEditor();

  const {
    isFullscreen,
    enableFullscreen,
    toggleFullscreen,
    wordCount,
    setWordCount,
    lastSaved,
    setLastSaved,
    autoSaveEnabled,
    lectureMode,
    isSaved,
    setIsSaved,
    changesMade,
    setChangesMade,
    toggleAutoSave,
    toggleLectureMode,
  } = useNoteEditorUI();

  // Using the content editor hook
  const { handleNoteContentChange } = useNoteEditorContent(
    handleNoteChange,
    setWordCount,
    setChangesMade
  );

  // Using the summary hook
  const {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    handleGenerateSummary,
    handleToggleSummary,
  } = useNoteEditorSummary(newNote, handleNoteChange);

  // Using the enhancement hook
  const { enhancing, handleEnhanceNote } = useNoteEditorEnhancement(
    newNote,
    handleNoteChange
  );

  // Using the save hook
  const { handleSave } = useNoteEditorSave(
    newNote,
    setIsSaved,
    setLastSaved,
    setChangesMade,
    resetEditor,
    setIsEditorExpanded,
    showSummary ? handleToggleSummary : () => {}
  );

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
