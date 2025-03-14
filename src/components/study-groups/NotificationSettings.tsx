
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface NotificationSettingsProps {
  groupId: string;
  initialEnabled: boolean;
}

export const NotificationSettings = ({ groupId, initialEnabled }: NotificationSettingsProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(initialEnabled);
  const queryClient = useQueryClient();

  const toggleNotificationsMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await supabase
        .from('study_groups')
        .update({ notification_enabled: enabled })
        .eq('id', groupId);
      
      if (error) throw error;
      return enabled;
    },
    onSuccess: (enabled) => {
      setNotificationsEnabled(enabled);
      queryClient.invalidateQueries({ queryKey: ['study-group', groupId] });
      toast.success(`Group notifications ${enabled ? 'enabled' : 'disabled'}`);
    },
    onError: (error) => {
      // Revert UI state on error
      setNotificationsEnabled(!notificationsEnabled);
      toast.error("Failed to update notification settings: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  });

  const handleToggleChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    toggleNotificationsMutation.mutate(checked);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch 
            id="notification-toggle"
            checked={notificationsEnabled}
            onCheckedChange={handleToggleChange}
            disabled={toggleNotificationsMutation.isPending}
          />
          <Label htmlFor="notification-toggle">
            {notificationsEnabled ? 'Email notifications enabled' : 'Email notifications disabled'}
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {notificationsEnabled 
            ? 'Members will receive email notifications about group activity.'
            : 'No email notifications will be sent to group members.'}
        </p>
      </CardContent>
    </Card>
  );
};
