
import { create } from "zustand";

interface NoteEditorStore {
  isEditorExpanded: boolean;
  setIsEditorExpanded: (value: boolean) => void;
  newNote: {
    title: string;
    content: string;
    subject: string;
    summary?: string;
  };
  handleNoteChange: (field: string, value: string | string[]) => void;
  resetEditor: () => void;
}

export const useNoteEditor = create<NoteEditorStore>((set) => ({
  isEditorExpanded: false,
  setIsEditorExpanded: (value) => set({ isEditorExpanded: value }),
  newNote: {
    title: "",
    content: "",
    subject: "General",
    summary: undefined
  },
  handleNoteChange: (field, value) =>
    set((state) => ({
      newNote: { ...state.newNote, [field]: value }
    })),
  resetEditor: () =>
    set({
      newNote: { title: "", content: "", subject: "General", summary: undefined },
      isEditorExpanded: false
    })
}));
