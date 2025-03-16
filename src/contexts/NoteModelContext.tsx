
import React, { createContext, useContext, useState } from "react";

// Define types for our context
interface NoteModelContextType {
  isOpen: boolean;
  openModel: (noteId?: string) => void;
  closeModel: () => void;
  currentNoteId: string | null;
}

// Create the context with default values
const NoteModelContext = createContext<NoteModelContextType>({
  isOpen: false,
  openModel: () => {},
  closeModel: () => {},
  currentNoteId: null
});

// Export a hook for easy use of the context
export const useNoteModel = () => useContext(NoteModelContext);

// Create the provider component
export const NoteModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  const openModel = (noteId?: string) => {
    if (noteId) {
      setCurrentNoteId(noteId);
    }
    setIsOpen(true);
  };

  const closeModel = () => {
    setIsOpen(false);
    // Optional: Reset currentNoteId when closing
    // setCurrentNoteId(null);
  };

  return (
    <NoteModelContext.Provider
      value={{
        isOpen,
        openModel,
        closeModel,
        currentNoteId
      }}
    >
      {children}
    </NoteModelContext.Provider>
  );
};
