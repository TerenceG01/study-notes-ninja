
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboutDescription } from "./group-about/AboutDescription";
import { AboutDescriptionEditor } from "./group-about/AboutDescriptionEditor";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GroupAboutProps {
  description: string | null;
  createdAt: string;
  groupId: string;
  userRole?: string;
}

export const GroupAbout = ({ description, createdAt, groupId, userRole }: GroupAboutProps) => {
  const canEdit = userRole === 'admin' || userRole === 'moderator';
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  // Handle starting the editing process
  const handleStartEditing = () => {
    setEditedDescription(description || "");
    setIsEditing(true);
  };
  
  // Handle canceling the edit
  const handleCancelEditing = () => {
    setEditedDescription(description || "");
    setIsEditing(false);
  };
  
  // Handle description changes in the editor
  const handleDescriptionChange = (value: string) => {
    setEditedDescription(value);
  };
  
  // Handle saving the description
  const handleSave = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log(`Updating description for group ${groupId} to: "${editedDescription}"`);
      
      // Direct update to database
      const { data, error } = await supabase
        .from('study_groups')
        .update({ description: editedDescription })
        .eq('id', groupId)
        .select();
        
      if (error) {
        throw error;
      }
      
      console.log("Description updated successfully:", data);
      
      // Force immediate invalidation of all related queries
      queryClient.invalidateQueries({ queryKey: ['study-group', groupId] });
      
      // Close the editor
      setIsEditing(false);
      toast.success("Group description updated");
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Failed to update description. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>About</CardTitle>
        {canEdit && !isEditing && (
          <Button variant="ghost" size="sm" onClick={handleStartEditing} className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit description</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <AboutDescriptionEditor
            description={editedDescription}
            onChange={handleDescriptionChange}
            onSave={handleSave}
            onCancel={handleCancelEditing}
            isLoading={isSubmitting}
          />
        ) : (
          <AboutDescription
            description={description}
            createdAt={createdAt}
            canEdit={canEdit}
          />
        )}
      </CardContent>
    </Card>
  );
};
