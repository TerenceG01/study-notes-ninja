
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Edit2, Save, X } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GroupAboutProps {
  description: string | null;
  createdAt: string;
  groupId: string;
  userRole?: string;
}

export const GroupAbout = ({ description, createdAt, groupId, userRole }: GroupAboutProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const queryClient = useQueryClient();
  
  const canEdit = userRole === 'admin' || userRole === 'moderator';

  // Add null check for createdAt
  if (!createdAt) {
    return null;
  }

  // Fetch group members' emails for notifications
  const { data: groupData } = useQuery({
    queryKey: ['study-group-notification-data', groupId],
    queryFn: async () => {
      // Get group name
      const { data: groupInfo, error: groupError } = await supabase
        .from('study_groups')
        .select('name')
        .eq('id', groupId)
        .single();
      
      if (groupError) throw groupError;
      
      // Get group member emails
      const { data: members, error: membersError } = await supabase
        .from('study_group_members')
        .select(`
          user_id,
          profiles!inner (
            id
          )
        `)
        .eq('group_id', groupId);
        
      if (membersError) throw membersError;
      
      // Get user emails from auth - this requires authorization
      const { data: userEmails, error: userEmailsError } = await supabase
        .auth
        .admin
        .listUsers();
        
      // If we can't get emails directly, we'll return just the group name
      // The edge function will receive only the edited by user email
      if (userEmailsError) {
        console.log("Unable to fetch user emails:", userEmailsError);
        return { 
          groupName: groupInfo.name,
          memberEmails: []
        };
      }
      
      // Match user IDs to emails
      const memberEmails = members
        .map(member => {
          const userEmail = userEmails.users.find(user => user.id === member.user_id)?.email;
          return userEmail;
        })
        .filter(Boolean) as string[];
      
      return {
        groupName: groupInfo.name,
        memberEmails
      };
    },
    enabled: !!groupId,
    // Only run this query when needed
    staleTime: Infinity,
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('study_groups')
        .update({ description: editedDescription })
        .eq('id', groupId);
      
      if (error) throw error;
      
      // Get current user email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error("Unable to get current user");
      
      // Send notification email to group members
      if (groupData?.groupName) {
        try {
          await supabase.functions.invoke('study-group-notifications', {
            body: {
              type: "description_update",
              email: user.email, // Send only to the user who made the change
              groupName: groupData.groupName,
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
      
      return true;
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['study-group', groupId] });
      toast.success("Group description updated");
    },
    onError: (error) => {
      toast.error("Failed to update description: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  });

  const handleSave = () => {
    updateDescriptionMutation.mutate();
  };

  const handleCancel = () => {
    setEditedDescription(description || "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>About</CardTitle>
        {canEdit && !isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit description</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <Textarea 
              value={editedDescription} 
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Add a description for your study group..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                disabled={updateDescriptionMutation.isPending}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={updateDescriptionMutation.isPending}
              >
                {updateDescriptionMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            {description || "No description provided."}
          </p>
        )}
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <CalendarDays className="h-4 w-4 mr-2" />
          Created {format(new Date(createdAt), 'PPP')}
        </div>
      </CardContent>
    </Card>
  );
};
