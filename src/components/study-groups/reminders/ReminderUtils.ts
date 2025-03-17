
import { format, isAfter, isBefore, startOfDay } from "date-fns";

// Helper function to determine if a date is in the past
export const isPastDate = (dateString: string) => {
  const today = startOfDay(new Date());
  const reminderDate = startOfDay(new Date(dateString));
  return isBefore(reminderDate, today);
};

// Helper function to determine if a date is today
export const isToday = (dateString: string) => {
  const today = startOfDay(new Date());
  const reminderDate = startOfDay(new Date(dateString));
  return today.getTime() === reminderDate.getTime();
};

// Helper function to determine if a date is within next 3 days
export const isUpcoming = (dateString: string) => {
  const today = startOfDay(new Date());
  const threeDaysLater = startOfDay(new Date());
  threeDaysLater.setDate(today.getDate() + 3);
  
  const reminderDate = startOfDay(new Date(dateString));
  
  return isAfter(reminderDate, today) && 
         isBefore(reminderDate, threeDaysLater) || 
         isToday(dateString);
};

// Format reminder date for display
export const formatReminderDate = (dateString: string) => {
  if (isToday(dateString)) {
    return "Today";
  }
  return format(new Date(dateString), "MMMM d, yyyy");
};
