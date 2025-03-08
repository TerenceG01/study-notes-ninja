
export type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder: string;
  summary?: string;
  tags?: string[];
  subject?: string;
  subject_color?: string;
  subject_order?: number;
};

export type NewNote = {
  title: string;
  content: string;
  tags: string[];
  subject: string;
};

// Re-export the types for backward compatibility
export * from "./useNotes";
