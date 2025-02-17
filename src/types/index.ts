
export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder?: string;
  summary?: string;
  tags?: string[];
  subject?: string;
  user_id: string;
}
