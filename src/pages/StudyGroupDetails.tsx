
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
import { GroupReminders } from "@/components/study-groups/GroupReminders";
import { useEffect } from "react";

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
  const { id } = useParams();
  const { user } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log("StudyGroupDetails mounted with id:", id);
  }, [id]);

  const { data: studyGroup, isLoading: isLoadingGroup, error: groupError } = useQuery({
    queryKey: ['study-group', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Study group not found');
      console.log("Study group details fetched:", data);
      return data as StudyGroup;
    },
    enabled: !!id,
    refetchOnWindowFocus: false
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['study-group-members', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_group_members')
        .select(`
          user_id,
          role,
          joined_at,
          profiles (
            username,
            full_name
          )
        `)
        .eq('group_id', id);

      if (error) throw error;
      console.log("Study group members fetched:", data?.length);
      return data as StudyGroupMember[];
    },
    enabled: !!id && !!studyGroup,
    refetchOnWindowFocus: false
  });

  if (isLoadingGroup || isLoadingMembers) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <main className="container mx-auto px-4 pt-20">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (groupError || !studyGroup) {
    console.error("Error loading study group:", groupError);
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <main className="container mx-auto px-4 pt-20">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Study Group Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The study group you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const userRole = members?.find(member => member.user_id === user?.id)?.role;
  console.log("User role in group:", userRole);

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        <div>
          <GroupHeader 
            name={studyGroup.name} 
            subject={studyGroup.subject} 
            userRole={userRole} 
            groupId={id!} // Ensure we pass the ID
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <GroupAbout 
                description={studyGroup.description} 
                createdAt={studyGroup.created_at} 
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Shared Notes</CardTitle>
                <CardDescription>
                  Notes shared by group members
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Key added to force re-render when the ID changes */}
                <SharedNotes key={`shared-notes-${id}`} groupId={studyGroup.id} />
              </CardContent>
            </Card>

            {userRole && (
              <Card>
                <CardHeader>
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

          <div className="space-y-6">
            <div>
              <GroupMembersList members={members || []} />
            </div>
            <div>
              <GroupReminders groupId={studyGroup.id} userRole={userRole} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyGroupDetails;
