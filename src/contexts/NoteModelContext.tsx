
import React, { createContext, useContext, useState } from "react";

// Define types for our context
interface NoteModelContextType {
  isOpen: boolean;
  openModel: (noteId?: string) => void;
  closeModel: () => void;
  currentNoteId: string | null;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
}

// Create the context with default values
const NoteModelContext = createContext<NoteModelContextType>({
  isOpen: false,
  openModel: () => {},
  closeModel: () => {},
  currentNoteId: null,
  selectedSubject: "General",
  setSelectedSubject: () => {}
});

// Export a hook for easy use of the context
export const useNoteModel = () => useContext(NoteModelContext);

// Create the provider component
export const NoteModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("General");

  const openModel = (noteId?: string) => {
    if (noteId) {
      setCurrentNoteId(noteId);
    }
    setIsOpen(true);
  };

  const closeModel = () => {
    setIsOpen(false);
    // Reset currentNoteId when closing
    setCurrentNoteId(null);
  };

  return (
    <NoteModelContext.Provider
      value={{
        isOpen,
        openModel,
        closeModel,
        currentNoteId,
        selectedSubject,
        setSelectedSubject
      }}
    >
      {children}
    </NoteModelContext.Provider>
  );
};
