import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { InviteMembers } from "@/components/study-groups/InviteMembers";
import { SharedNotes } from "@/components/study-groups/SharedNotes";
import { GroupHeader } from "@/components/study-groups/GroupHeader";
import { GroupAbout } from "@/components/study-groups/GroupAbout";
import { GroupMembersList } from "@/components/study-groups/GroupMembersList";
interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  created_by: string;
  created_at: string;
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
const StudyGroupDetails = () => {
  const {
    id
  } = useParams();
  const {
    user
  } = useAuth();
  const {
    data: studyGroup,
    isLoading: isLoadingGroup
  } = useQuery({
    queryKey: ['study-group', id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('study_groups').select('*').eq('id', id).single();
      if (error) throw error;
      return data as StudyGroup;
    },
    enabled: !!id
  });
  const {
    data: members,
    isLoading: isLoadingMembers
  } = useQuery({
    queryKey: ['study-group-members', id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('study_group_members').select(`
          user_id,
          role,
          joined_at,
          profiles (
            username,
            full_name
          )
        `).eq('group_id', id);
      if (error) throw error;
      return data as StudyGroupMember[];
    },
    enabled: !!id
  });
  if (isLoadingGroup || isLoadingMembers) {
    return <div className="min-h-screen bg-background">
        <NavigationBar />
        <main className="container mx-auto px-4 pt-20">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>;
  }
  if (!studyGroup) {
    return <div className="min-h-screen bg-background">
        <NavigationBar />
        <main className="container mx-auto px-4 pt-20">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Study Group Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The study group you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </main>
      </div>;
  }
  const userRole = members?.find(member => member.user_id === user?.id)?.role;
  return <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container pt-20 mx-[50px] my-[10px] px-[10px] py-[5px]">
        <GroupHeader name={studyGroup.name} subject={studyGroup.subject} userRole={userRole} groupId={studyGroup.id} />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <GroupAbout description={studyGroup.description} createdAt={studyGroup.created_at} />

            <Card>
              <CardHeader>
                <CardTitle>Shared Notes</CardTitle>
                <CardDescription>
                  Notes shared by group members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SharedNotes groupId={studyGroup.id} />
              </CardContent>
            </Card>

            {userRole && <Card>
                <CardHeader>
                  <CardTitle>Invite Members</CardTitle>
                  <CardDescription>
                    Invite other students to join this study group
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InviteMembers groupId={studyGroup.id} />
                </CardContent>
              </Card>}
          </div>

          <div>
            <GroupMembersList members={members || []} />
          </div>
        </div>
      </main>
    </div>;
};
export default StudyGroupDetails;