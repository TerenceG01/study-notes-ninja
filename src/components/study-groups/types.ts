
export interface SharedNote {
  id: string;
  note_id: string;
  note: {
    id: string;
    title: string;
    content: string;
    created_at: string;
  };
  shared_by: string;
  shared_at: string;
  display_order: number;
  shared_by_profile: {
    username: string | null;
    full_name: string | null;
  } | null;
}

export interface SharedNotesProps {
  groupId: string;
}
