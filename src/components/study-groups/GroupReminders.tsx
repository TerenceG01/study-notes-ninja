
import { useIsMobile } from "@/hooks/use-mobile";
import { GroupRemindersProps } from "./reminders/ReminderTypes";
import { useReminders } from "./reminders/useReminders";
import { ReminderForm } from "./reminders/ReminderForm";
import { ReminderList } from "./reminders/ReminderList";
import { EmptyReminders } from "./reminders/EmptyReminders";

export function GroupReminders({ groupId, userRole }: GroupRemindersProps) {
  const isMobile = useIsMobile();
  const { reminders, isLoading, createReminder, deleteReminder } = useReminders(groupId);

  const handleCreateReminder = (title: string, date: Date) => {
    createReminder.mutate({ title, date });
  };

  const handleDeleteReminder = (reminderId: string) => {
    deleteReminder.mutate(reminderId);
  };

  return (
    <div className="space-y-4">
      {userRole && (
        <ReminderForm onSubmit={handleCreateReminder} />
      )}

      <div className="space-y-3">
        {!isLoading && reminders.length > 0 && (
          <ReminderList 
            reminders={reminders} 
            onDelete={handleDeleteReminder}
            userRole={userRole}
          />
        )}
        
        {!isLoading && reminders.length === 0 && (
          <EmptyReminders userRole={userRole} />
        )}
      </div>
    </div>
  );
}
