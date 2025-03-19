
import { CalendarDays } from "lucide-react";

interface EmptyRemindersProps {
  userRole?: string;
}

export function EmptyReminders({ userRole }: EmptyRemindersProps) {
  return (
    <div className="py-6 text-center">
      <CalendarDays className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
      <p className="text-sm text-muted-foreground">
        No reminders yet
      </p>
      {userRole && (
        <p className="text-xs text-muted-foreground mt-1">
          Add important dates for your group
        </p>
      )}
    </div>
  );
}
