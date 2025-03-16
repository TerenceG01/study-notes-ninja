
import { useState } from "react";
import { useFullscreenState } from "@/hooks/useFullscreenState";

export const useNoteEditorUI = () => {
  const { isFullscreen, enableFullscreen, toggleFullscreen } = useFullscreenState();
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lectureMode, setLectureMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };

  const toggleLectureMode = () => {
    setLectureMode(!lectureMode);
  };

  return {
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
  };
};
