
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboutDescription } from "./group-about/AboutDescription";
import { AboutDescriptionEditor } from "./group-about/AboutDescriptionEditor";
import { useGroupNotifications } from "./group-about/useGroupNotifications";
import { useGroupDescription } from "./group-about/useGroupDescription";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface GroupAboutProps {
  description: string | null;
  createdAt: string;
  groupId: string;
  userRole?: string;
}

export const GroupAbout = ({ description: initialDescription, createdAt, groupId, userRole }: GroupAboutProps) => {
  const canEdit = userRole === 'admin' || userRole === 'moderator';
  
  // Get group data for notifications
  const { data: groupData } = useGroupNotifications(groupId);
  
  // Fetch the latest description directly from the database with aggressive refetching strategy
  const { data: latestDescription, isLoading: isLoadingDescription, refetch } = useQuery({
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
    refetchOnWindowFocus: true,
    staleTime: 0, // Don't cache this data
    refetchInterval: 3000, // Refetch every 3 seconds to ensure fresh data
    retry: 3,
    retryDelay: 1000
  });

  // Force a refresh when the component mounts to ensure we have fresh data
  useEffect(() => {
    // Initial fetch
    refetch();
    
    // Set up regular refetching interval
    const intervalId = setInterval(() => {
      refetch();
    }, 5000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [refetch, groupId]);
  
  // Use the latest description from the database, or fall back to the prop if not loaded yet
  const currentDescription = isLoadingDescription ? initialDescription : latestDescription;
  
  // Handle description editing state and mutations
  const {
    isEditing,
    editedDescription,
    isPending,
    handleStartEditing,
    handleCancelEditing,
    handleSave,
    handleDescriptionChange
  } = useGroupDescription(groupId, currentDescription, groupData?.groupName);

  // Debug what's displayed
  console.log("GroupAbout rendering with description:", {
    initialDescription,
    latestDescription,
    currentDescription,
    editedDescription,
    isEditing
  });
  
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
            description={currentDescription}
            createdAt={createdAt}
          />
        )}
      </CardContent>
    </Card>
  );
};
