
export interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  created_by: string;
  created_at: string;
}

export interface GroupRemindersProps {
  groupId: string;
  userRole?: string;
}
