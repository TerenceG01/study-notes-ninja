export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder: string;
  summary?: string;
  subject?: string;
  subject_color?: string;
  custom_color?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  created_at: string;
}
