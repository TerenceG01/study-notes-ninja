
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  CalendarDays
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  created_by: string;
  created_at: string;
}

interface GroupRemindersProps {
  groupId: string;
  userRole?: string;
}

export function GroupReminders({ groupId, userRole }: GroupRemindersProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['group-reminders', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_group_reminders')
        .select('*')
        .eq('group_id', groupId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data as Reminder[];
    }
  });

  const createReminder = useMutation({
    mutationFn: async () => {
      if (!date || !title.trim() || !user) {
        throw new Error("Please provide both title and date");
      }

      const { error } = await supabase
        .from('study_group_reminders')
        .insert([
          {
            group_id: groupId,
            title: title.trim(),
            due_date: date.toISOString(),
            created_by: user.id
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-reminders'] });
      setTitle("");
      setDate(undefined);
      toast({
        title: "Reminder created",
        description: "Your reminder has been added to the group.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create reminder. Please try again.",
      });
    }
  });

  const deleteReminder = useMutation({
    mutationFn: async (reminderId: string) => {
      const { error } = await supabase
        .from('study_group_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-reminders'] });
      toast({
        title: "Reminder deleted",
        description: "The reminder has been removed.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete reminder. Please try again.",
      });
    }
  });

  // Helper function to determine if a date is in the past
  const isPastDate = (dateString: string) => {
    const today = startOfDay(new Date());
    const reminderDate = startOfDay(new Date(dateString));
    return isBefore(reminderDate, today);
  };

  // Helper function to determine if a date is today
  const isToday = (dateString: string) => {
    const today = startOfDay(new Date());
    const reminderDate = startOfDay(new Date(dateString));
    return today.getTime() === reminderDate.getTime();
  };

  // Helper function to determine if a date is within next 3 days
  const isUpcoming = (dateString: string) => {
    const today = startOfDay(new Date());
    const threeDaysLater = startOfDay(new Date());
    threeDaysLater.setDate(today.getDate() + 3);
    
    const reminderDate = startOfDay(new Date(dateString));
    
    return isAfter(reminderDate, today) && 
           isBefore(reminderDate, threeDaysLater) || 
           isToday(dateString);
  };

  return (
    <div className="space-y-4">
      {userRole && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createReminder.mutate();
          }}
          className="flex flex-col gap-3"
        >
          <div className="w-full">
            <Textarea
              placeholder="Add a new reminder or deadline..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full min-h-[60px] resize-y text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {date ? format(date, "MMM d") : <span>Pick date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Button 
              type="submit" 
              size="sm" 
              className="shrink-0"
              disabled={!date || !title.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {!isLoading && reminders.length > 0 && (
          <div className="grid gap-2">
            {/* Past reminders */}
            {reminders.filter(r => isPastDate(r.due_date) && !isToday(r.due_date)).length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Past</span>
                </div>
                {reminders
                  .filter(r => isPastDate(r.due_date) && !isToday(r.due_date))
                  .map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/50"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 text-muted-foreground mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-muted-foreground line-clamp-1">{reminder.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(reminder.due_date), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      {userRole && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => deleteReminder.mutate(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Today and upcoming reminders */}
            {reminders.filter(r => isUpcoming(r.due_date)).length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-amber-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>Upcoming</span>
                </div>
                {reminders
                  .filter(r => isUpcoming(r.due_date))
                  .map((reminder) => (
                    <div
                      key={reminder.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md border",
                        isToday(reminder.due_date) 
                          ? "bg-amber-500/10 border-amber-500/30" 
                          : "bg-primary/5 border-primary/20"
                      )}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={cn(
                          "flex-shrink-0 mt-0.5",
                          isToday(reminder.due_date) ? "text-amber-500" : "text-primary"
                        )}>
                          {isToday(reminder.due_date) ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <CalendarDays className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{reminder.title}</p>
                          <p className={cn(
                            "text-xs",
                            isToday(reminder.due_date) ? "text-amber-500" : "text-muted-foreground"
                          )}>
                            {isToday(reminder.due_date) 
                              ? "Today" 
                              : format(new Date(reminder.due_date), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      {userRole && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => deleteReminder.mutate(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Future reminders */}
            {reminders.filter(r => !isPastDate(r.due_date) && !isUpcoming(r.due_date)).length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  <span>Future</span>
                </div>
                {reminders
                  .filter(r => !isPastDate(r.due_date) && !isUpcoming(r.due_date))
                  .map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border/50"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 text-muted-foreground mt-0.5">
                          <CalendarIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{reminder.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(reminder.due_date), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      {userRole && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => deleteReminder.mutate(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
        
        {!isLoading && reminders.length === 0 && (
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
        )}
      </div>
    </div>
  );
}
