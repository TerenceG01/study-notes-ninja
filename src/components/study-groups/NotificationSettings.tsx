
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <Card className="w-full transition-all duration-300 hover:shadow-md bg-card/80 backdrop-blur-sm border-accent/50">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-medium">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span>Notification Settings</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Configure email notifications for this group</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Switch 
              id="notification-toggle"
              checked={notificationsEnabled}
              onCheckedChange={handleToggleChange}
              disabled={toggleNotificationsMutation.isPending}
              className="data-[state=checked]:bg-primary/90"
            />
            <Label 
              htmlFor="notification-toggle" 
              className="font-medium text-sm sm:text-base cursor-pointer"
            >
              {notificationsEnabled ? 'Email notifications enabled' : 'Email notifications disabled'}
            </Label>
          </div>
          
          <div className={`px-3 py-2 rounded-md transition-all duration-300 text-xs sm:text-sm ${
            notificationsEnabled 
              ? 'bg-primary/10 text-primary-foreground/90 dark:bg-primary/20' 
              : 'bg-muted/50 text-muted-foreground'
          }`}>
            {notificationsEnabled 
              ? 'Members will receive email notifications about group activity, including new reminders and shared notes.'
              : 'No email notifications will be sent to group members. Members can still see updates when they visit the group.'}
          </div>
          
          {toggleNotificationsMutation.isPending && (
            <div className="text-xs text-muted-foreground animate-pulse">
              Updating settings...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
