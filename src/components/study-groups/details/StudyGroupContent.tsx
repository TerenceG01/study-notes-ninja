
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupHeader } from "@/components/study-groups/GroupHeader";
import { GroupMembersList } from "@/components/study-groups/GroupMembersList";
import { GroupReminders } from "@/components/study-groups/GroupReminders";
import { NotificationSettings } from "@/components/study-groups/NotificationSettings";
import { SharedNotes } from "@/components/study-groups/SharedNotes";
import { InviteMembers } from "@/components/study-groups/InviteMembers";

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  created_by: string;
  created_at: string;
  notification_enabled: boolean;
}

interface StudyGroupMember {
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
}

interface StudyGroupContentProps {
  studyGroup: StudyGroup;
  members: StudyGroupMember[];
  userRole: string | undefined;
  userId: string | undefined;
}

export const StudyGroupContent = ({ 
  studyGroup, 
  members, 
  userRole, 
  userId 
}: StudyGroupContentProps) => {
  const isAdmin = userRole === 'admin';
  console.log("User role in group:", userRole);
  console.log("Study group data in content:", studyGroup);

  return (
    <div>
      <GroupHeader 
        name={studyGroup.name} 
        subject={studyGroup.subject} 
        userRole={userRole} 
        groupId={studyGroup.id}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Shared Notes</CardTitle>
              <CardDescription>
                Notes shared by group members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SharedNotes key={`shared-notes-${studyGroup.id}`} groupId={studyGroup.id} />
            </CardContent>
          </Card>

          {userRole && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Invite Members</CardTitle>
                <CardDescription>
                  Invite other students to join this study group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InviteMembers groupId={studyGroup.id} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <GroupMembersList members={members || []} />
          </div>
          <div>
            <GroupReminders groupId={studyGroup.id} userRole={userRole} />
          </div>
          
          {isAdmin && (
            <div>
              <NotificationSettings 
                groupId={studyGroup.id} 
                initialEnabled={studyGroup.notification_enabled} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
