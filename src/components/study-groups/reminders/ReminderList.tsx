
import { 
  CheckCircle2, 
  AlertCircle,
  CalendarIcon,
  CalendarDays
} from "lucide-react";
import { ReminderItem } from "./ReminderItem";
import { Reminder } from "./ReminderTypes";
import { isPastDate, isToday, isUpcoming } from "./ReminderUtils";

interface ReminderGroupProps {
  title: string;
  icon: React.ReactNode;
  reminders: Reminder[];
  isPast?: boolean;
  isUpcoming?: boolean;
  iconClassName?: string;
  onDelete?: (id: string) => void;
  userRole?: string;
}

function ReminderGroup({ 
  title, 
  icon, 
  reminders, 
  isPast, 
  isUpcoming, 
  iconClassName,
  onDelete,
  userRole
}: ReminderGroupProps) {
  if (reminders.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className={`flex items-center gap-1 text-xs ${iconClassName || "text-muted-foreground"}`}>
        {icon}
        <span>{title}</span>
      </div>
      {reminders.map((reminder) => (
        <ReminderItem 
          key={reminder.id} 
          reminder={reminder} 
          isPast={isPast}
          isUpcoming={isUpcoming}
          onDelete={onDelete}
          userRole={userRole}
        />
      ))}
    </div>
  );
}

interface ReminderListProps {
  reminders: Reminder[];
  onDelete?: (id: string) => void;
  userRole?: string;
}

export function ReminderList({ reminders, onDelete, userRole }: ReminderListProps) {
  // Filter reminders by category
  const pastReminders = reminders.filter(r => isPastDate(r.due_date) && !isToday(r.due_date));
  const upcomingReminders = reminders.filter(r => isUpcoming(r.due_date));
  const futureReminders = reminders.filter(r => !isPastDate(r.due_date) && !isUpcoming(r.due_date));
  
  return (
    <div className="grid gap-2">
      <ReminderGroup
        title="Upcoming"
        icon={<AlertCircle className="h-3 w-3" />}
        reminders={upcomingReminders}
        isUpcoming={true}
        iconClassName="text-amber-500"
        onDelete={onDelete}
        userRole={userRole}
      />
      
      <ReminderGroup
        title="Future"
        icon={<CalendarIcon className="h-3 w-3" />}
        reminders={futureReminders}
        onDelete={onDelete}
        userRole={userRole}
      />
      
      <ReminderGroup
        title="Past"
        icon={<CheckCircle2 className="h-3 w-3" />}
        reminders={pastReminders}
        isPast={true}
        onDelete={onDelete}
        userRole={userRole}
      />
    </div>
  );
}
