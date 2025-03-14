
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboutDescription } from "./group-about/AboutDescription";
import { AboutDescriptionEditor } from "./group-about/AboutDescriptionEditor";
import { useGroupNotifications } from "./group-about/useGroupNotifications";
import { useGroupDescription } from "./group-about/useGroupDescription";

interface GroupAboutProps {
  description: string | null;
  createdAt: string;
  groupId: string;
  userRole?: string;
}

export const GroupAbout = ({ description, createdAt, groupId, userRole }: GroupAboutProps) => {
  const canEdit = userRole === 'admin' || userRole === 'moderator';
  
  // Add null check for createdAt
  if (!createdAt) {
    return null;
  }

  // Get group data for notifications
  const { data: groupData } = useGroupNotifications(groupId);
  
  // Handle description editing state and mutations
  const {
    isEditing,
    editedDescription,
    isPending,
    handleStartEditing,
    handleCancelEditing,
    handleSave,
    handleDescriptionChange
  } = useGroupDescription(groupId, description, groupData?.groupName);

  console.log("Rendering GroupAbout with description:", description);
  console.log("Editing state:", isEditing, "Edited description:", editedDescription);

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
            description={description}
            createdAt={createdAt}
          />
        )}
      </CardContent>
    </Card>
  );
};
