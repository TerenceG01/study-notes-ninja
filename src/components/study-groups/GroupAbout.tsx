
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Edit2, Save, X } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const updateDescriptionMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('study_groups')
        .update({ description: editedDescription })
        .eq('id', groupId);
      
      if (error) throw error;
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
