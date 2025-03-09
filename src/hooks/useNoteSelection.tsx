
import { useState } from "react";
import { Note } from "@/hooks/useNotes";

export const useNoteSelection = () => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Handle note click to open the editing dialog
  const handleNoteClick = (note: Note) => {
    console.log("Note clicked:", note.title);
    // Make sure note has empty tags array for compatibility
    note.tags = note.tags || [];
    setSelectedNote(note);
    setEditingNote(note);
  };

  return {
    selectedNote,
    setSelectedNote,
    editingNote,
    setEditingNote,
    handleNoteClick
  };
};
