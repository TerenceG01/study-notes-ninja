
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Plus, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Important Dates</CardTitle>
        <CardDescription>
          Course deadlines and milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {userRole && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createReminder.mutate();
            }}
            className="flex gap-2 mb-4"
          >
            <Input
              placeholder="Add a new reminder..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[120px]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMM d") : <span>Pick date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        )}

        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{reminder.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(reminder.due_date), "MMM d, yyyy")}
                </p>
              </div>
              {userRole && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteReminder.mutate(reminder.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {!isLoading && reminders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No reminders yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
