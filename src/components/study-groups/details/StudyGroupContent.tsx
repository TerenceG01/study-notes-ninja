
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupHeader } from "@/components/study-groups/GroupHeader";
import { GroupMembersList } from "@/components/study-groups/GroupMembersList";
import { GroupReminders } from "@/components/study-groups/GroupReminders";
import { NotificationSettings } from "@/components/study-groups/NotificationSettings";
import { SharedNotes } from "@/components/study-groups/SharedNotes";
import { InviteMembers } from "@/components/study-groups/InviteMembers";
import { BookOpen, Users, Bell } from "lucide-react";

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
    <div className="space-y-6 animate-fade-in">
      <GroupHeader 
        name={studyGroup.name} 
        subject={studyGroup.subject} 
        userRole={userRole} 
        groupId={studyGroup.id}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Shared Notes
              </CardTitle>
              <CardDescription>
                Notes shared by group members for collaborative studying
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SharedNotes key={`shared-notes-${studyGroup.id}`} groupId={studyGroup.id} />
            </CardContent>
          </Card>

          {userRole && (
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Invite Members
                </CardTitle>
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

        <div className="space-y-6">
          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Group Members
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <GroupMembersList members={members || []} />
            </CardContent>
          </Card>
          
          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <GroupReminders groupId={studyGroup.id} userRole={userRole} />
            </CardContent>
          </Card>
          
          {isAdmin && (
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <NotificationSettings 
                  groupId={studyGroup.id} 
                  initialEnabled={studyGroup.notification_enabled} 
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
