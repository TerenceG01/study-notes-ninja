
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useGroupDescription = (
  groupId: string, 
  initialDescription: string | null,
  groupName?: string
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(initialDescription || "");
  const queryClient = useQueryClient();

  const updateDescriptionMutation = useMutation({
    mutationFn: async () => {
      console.log("Updating description for group:", groupId);
      console.log("New description:", editedDescription);
      
      const { data, error } = await supabase
        .from('study_groups')
        .update({ description: editedDescription })
        .eq('id', groupId)
        .select("*");
      
      if (error) {
        console.error("Error updating description:", error);
        throw error;
      }
      
      console.log("Description updated successfully", data);
      
      // Get current user email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error("Unable to get current user");
      
      // Send notification email to group members
      if (groupName) {
        try {
          await supabase.functions.invoke('study-group-notifications', {
            body: {
              type: "description_update",
              email: user.email, // Send only to the user who made the change
              groupName: groupName,
              groupId: groupId, // Pass groupId to check notification settings
              details: {
                newDescription: editedDescription
              }
            },
          });
          console.log("Description update notification sent");
        } catch (emailError) {
          console.error("Failed to send notification email:", emailError);
          // Don't block the UI flow if email fails
        }
      }
      
      return data;
    },
    onSuccess: (data) => {
      setIsEditing(false);
      
      // Force update the cache with the new data
      queryClient.setQueryData(['study-group', groupId], (oldData: any) => {
        if (!oldData) return data?.[0] || null;
        return { ...oldData, description: editedDescription };
      });
      
      // Also invalidate the query to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: ['study-group', groupId] });
      
      toast.success("Group description updated");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to update description: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  });

  const handleStartEditing = () => setIsEditing(true);
  const handleCancelEditing = () => {
    setEditedDescription(initialDescription || "");
    setIsEditing(false);
  };
  const handleSave = () => updateDescriptionMutation.mutate();
  const handleDescriptionChange = (value: string) => setEditedDescription(value);

  return {
    isEditing,
    editedDescription,
    isPending: updateDescriptionMutation.isPending,
    handleStartEditing,
    handleCancelEditing,
    handleSave,
    handleDescriptionChange
  };
};
