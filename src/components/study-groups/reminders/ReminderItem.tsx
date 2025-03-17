
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Clock, 
  Trash2, 
  CalendarIcon,
  CalendarDays 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reminder } from "./ReminderTypes";
import { formatReminderDate, isToday } from "./ReminderUtils";

interface ReminderItemProps {
  reminder: Reminder;
  isPast?: boolean;
  isUpcoming?: boolean;
  onDelete?: (id: string) => void;
  userRole?: string;
}

export function ReminderItem({ 
  reminder, 
  isPast, 
  isUpcoming, 
  onDelete,
  userRole 
}: ReminderItemProps) {
  const reminderDate = new Date(reminder.due_date);
  const isTodayReminder = isToday(reminder.due_date);
  
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-md border",
        isPast ? "bg-muted/40 border-border/50" : 
        isTodayReminder ? "bg-amber-500/10 border-amber-500/30" : 
        isUpcoming ? "bg-primary/5 border-primary/20" :
        "bg-muted/50 border-border/50"
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={cn(
          "flex-shrink-0 mt-0.5",
          isPast ? "text-muted-foreground" :
          isTodayReminder ? "text-amber-500" : 
          isUpcoming ? "text-primary" :
          "text-muted-foreground"
        )}>
          {isPast ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : isTodayReminder ? (
            <Clock className="h-4 w-4" />
          ) : isUpcoming ? (
            <CalendarDays className="h-4 w-4" />
          ) : (
            <CalendarIcon className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-medium text-sm line-clamp-1",
            isPast && "text-muted-foreground"
          )}>
            {reminder.title}
          </p>
          <p className={cn(
            "text-xs",
            isPast ? "text-muted-foreground" :
            isTodayReminder ? "text-amber-500" : 
            "text-muted-foreground"
          )}>
            {formatReminderDate(reminder.due_date)}
          </p>
        </div>
      </div>
      {userRole && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
          onClick={() => onDelete && onDelete(reminder.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
