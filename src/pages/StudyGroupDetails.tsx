import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, Users, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { InviteMembers } from "@/components/study-groups/InviteMembers";
import { Separator } from "@/components/ui/separator";
import { ShareNote } from "@/components/study-groups/ShareNote";
import { SharedNotes } from "@/components/study-groups/SharedNotes";

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
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: studyGroup, isLoading: isLoadingGroup } = useQuery({
    queryKey: ['study-group', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as StudyGroup;
    },
    enabled: !!id,
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
      return data as StudyGroupMember[];
    },
    enabled: !!id,
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

  if (!studyGroup) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <main className="container mx-auto px-4 pt-20">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Study Group Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The study group you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/study-groups')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Study Groups
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const userRole = members?.find(member => member.user_id === user?.id)?.role;

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4 pt-20">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/study-groups')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Study Groups
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold">{studyGroup.name}</h1>
              <p className="text-lg text-muted-foreground mt-2">{studyGroup.subject}</p>
            </div>
            {userRole && <ShareNote groupId={studyGroup.id} />}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {studyGroup.description || "No description provided."}
                </p>
                <div className="flex items-center text-sm text-muted-foreground mt-4">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Created {format(new Date(studyGroup.created_at), 'PPP')}
                </div>
              </CardContent>
            </Card>

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

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Members ({members?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members?.map((member) => (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {member.profiles?.username || member.profiles?.full_name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyGroupDetails;
