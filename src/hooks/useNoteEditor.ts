
import { useState } from "react";
import type { Note } from "@/hooks/useNotes";

export const useNoteEditor = (initialSubject = "General") => {
  const [newNote, setNewNote] = useState({ 
    title: "", 
    content: "", 
    tags: [] as string[], 
    subject: initialSubject,
    workbook: "General"
  });
  const [newTag, setNewTag] = useState("");
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  const handleNoteChange = (field: string, value: string | string[]) => {
    setNewNote(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag && !newNote.tags.includes(newTag)) {
      setNewNote({
        ...newNote,
        tags: [...newNote.tags, newTag]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const resetEditor = () => {
    setNewNote({ title: "", content: "", tags: [], subject: initialSubject, workbook: "General" });
    setIsEditorExpanded(false);
  };

  return {
    newNote,
    newTag,
    isEditorExpanded,
    setNewTag,
    setIsEditorExpanded,
    handleNoteChange,
    addTag,
    removeTag,
    resetEditor,
  };
};
