
import { create } from "zustand";

interface NoteEditorStore {
  isEditorExpanded: boolean;
  setIsEditorExpanded: (value: boolean) => void;
  newNote: {
    title: string;
    content: string;
    tags: string[];
    subject: string | null;
    subject_color: string | null;
  };
  newTag: string;
  setNewTag: (value: string) => void;
  handleNoteChange: (field: string, value: string | string[] | null) => void;
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
    subject: "General",
    subject_color: null
  },
  newTag: "",
  setNewTag: (value) => set({ newTag: value }),
  handleNoteChange: (field, value) =>
    set((state) => ({
      newNote: { ...state.newNote, [field]: value }
    })),
  addTag: () =>
    set((state) => {
      if (state.newTag && !state.newNote.tags.includes(state.newTag)) {
        return {
          newNote: {
            ...state.newNote,
            tags: [...state.newNote.tags, state.newTag]
          },
          newTag: ""
        };
      }
      return state;
    }),
  removeTag: (tagToRemove) =>
    set((state) => ({
      newNote: {
        ...state.newNote,
        tags: state.newNote.tags.filter((tag) => tag !== tagToRemove)
      }
    })),
  resetEditor: () =>
    set({
      newNote: {
        title: "",
        content: "",
        tags: [],
        subject: "General",
        subject_color: null
      },
      newTag: "",
      isEditorExpanded: false
    })
}));
