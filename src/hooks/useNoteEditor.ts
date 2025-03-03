
import { create } from "zustand";

interface NoteEditorStore {
  isEditorExpanded: boolean;
  setIsEditorExpanded: (value: boolean) => void;
  newNote: {
    title: string;
    content: string;
    tags: string[];
    subject: string;
  };
  newTag: string;
  setNewTag: (value: string) => void;
  handleNoteChange: (field: string, value: string | string[]) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  resetEditor: () => void;
}

export const useNoteEditor = create<NoteEditorStore>((set) => ({
  isEditorExpanded: false,
  setIsEditorExpanded: (value) => set({ isEditorExpanded: value }),
  newNote: {
    title: "",
    content: "",
    tags: [],
    subject: "General"
  },
  newTag: "",
  setNewTag: (value) => set({ newTag: value }),
  handleNoteChange: (field, value) =>
    set((state) => ({
      newNote: { ...state.newNote, [field]: value }
    })),
  // Tag functions kept for compatibility but made into no-ops
  addTag: () => set((state) => state),
  removeTag: (tagToRemove) => set((state) => state),
  resetEditor: () =>
    set({
      newNote: { title: "", content: "", tags: [], subject: "General" },
      newTag: "",
      isEditorExpanded: false
    })
}));
