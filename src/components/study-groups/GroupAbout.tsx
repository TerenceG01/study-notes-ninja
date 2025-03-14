
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboutDescription } from "./group-about/AboutDescription";
import { AboutDescriptionEditor } from "./group-about/AboutDescriptionEditor";
import { useGroupNotifications } from "./group-about/useGroupNotifications";
import { useGroupDescription } from "./group-about/useGroupDescription";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GroupAboutProps {
  description: string | null;
  createdAt: string;
  groupId: string;
  userRole?: string;
}

export const GroupAbout = ({ description, createdAt, groupId, userRole }: GroupAboutProps) => {
  const canEdit = userRole === 'admin' || userRole === 'moderator';
  const queryClient = useQueryClient();
  
  // Get group data for notifications
  const { data: groupData } = useGroupNotifications(groupId);
  
  // Fetch the latest description directly from the database
  const { data: latestDescription } = useQuery({
    queryKey: ['group-description', groupId],
    queryFn: async () => {
      console.log("Fetching latest group description for:", groupId);
      const { data, error } = await supabase
        .from('study_groups')
        .select('description')
        .eq('id', groupId)
        .single();
        
      if (error) {
        console.error("Error fetching description:", error);
        throw error;
      }
      
      console.log("Latest description fetched:", data);
      return data.description;
    },
    refetchOnWindowFocus: false
  });
  
  // Handle description editing state and mutations
  const {
    isEditing,
    editedDescription,
    isPending,
    handleStartEditing,
    handleCancelEditing,
    handleSave,
    handleDescriptionChange
  } = useGroupDescription(groupId, latestDescription ?? description, groupData?.groupName);
  
  // Always show the latest description from the query, falling back to props if query hasn't loaded
  const displayDescription = latestDescription !== undefined ? latestDescription : description;
  
  // Debug rendered description
  useEffect(() => {
    console.log("GroupAbout displaying description:", displayDescription);
  }, [displayDescription]);
  
  // Add null check for createdAt
  if (!createdAt) {
    return null;
  }

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
            isLoading={isPending}
          />
        ) : (
          <AboutDescription
            description={displayDescription}
            createdAt={createdAt}
          />
        )}
      </CardContent>
    </Card>
  );
};
