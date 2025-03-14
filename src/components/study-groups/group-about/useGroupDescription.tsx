
import { useState, useEffect } from "react";
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

  // Sync editedDescription when initialDescription changes and not editing
  useEffect(() => {
    // Only sync when not actively editing
    if (!isEditing) {
      console.log("Syncing edited description with initial:", initialDescription);
      setEditedDescription(initialDescription || "");
    }
  }, [initialDescription, isEditing]);

  const updateDescriptionMutation = useMutation({
    mutationFn: async () => {
      console.log("Updating description for group:", groupId);
      console.log("New description:", editedDescription);
      
      // Force fetch current state before updating to ensure we're operating on latest data
      const currentState = await supabase
        .from('study_groups')
        .select('description')
        .eq('id', groupId)
        .single();
      
      console.log("Current state before update:", currentState.data);
      
      const { data, error } = await supabase
        .from('study_groups')
        .update({ description: editedDescription })
        .eq('id', groupId)
        .select();
      
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
    onSuccess: () => {
      setIsEditing(false);
      
      // Immediately update the cache with the new description
      queryClient.setQueryData(['group-description', groupId], editedDescription);
      
      // Also invalidate both group queries to fetch fresh data
      queryClient.invalidateQueries({ 
        queryKey: ['study-group', groupId]
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['group-description', groupId]
      });
      
      // Force refetch to ensure we have the latest data
      queryClient.refetchQueries({
        queryKey: ['group-description', groupId],
        type: 'active',
      });
      
      toast.success("Group description updated");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to update description: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  });

  const handleStartEditing = () => {
    console.log("Starting edit with description:", initialDescription);
    setIsEditing(true);
  };
  
  const handleCancelEditing = () => {
    console.log("Canceling edit, resetting to:", initialDescription);
    setEditedDescription(initialDescription || "");
    setIsEditing(false);
  };
  
  const handleSave = () => {
    console.log("Saving description:", editedDescription);
    updateDescriptionMutation.mutate();
  };
  
  const handleDescriptionChange = (value: string) => {
    console.log("Description changed to:", value);
    setEditedDescription(value);
  };

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
