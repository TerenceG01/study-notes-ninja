
export const useNoteEditorContent = (
  handleNoteChange: (field: string, value: string | string[]) => void,
  setWordCount: (count: number) => void,
  setChangesMade: (changed: boolean) => void
) => {
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

  return {
    handleNoteContentChange,
  };
};
