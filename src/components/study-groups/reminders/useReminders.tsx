
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Reminder } from "./ReminderTypes";

export function useReminders(groupId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

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
    mutationFn: async ({ title, date }: { title: string, date: Date }) => {
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

  return {
    reminders,
    isLoading,
    createReminder,
    deleteReminder
  };
}
