
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Users, BookOpen, Calendar } from "lucide-react";
import { CreateStudyGroupForm } from "@/components/study-groups/CreateStudyGroupForm";
import { format } from "date-fns";

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

const StudyGroups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { data: studyGroups, isLoading } = useQuery({
    queryKey: ['study-groups'],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc('get_user_study_groups', {
        p_user_id: user.id
      });

      if (error) throw error;
      return (data || []) as StudyGroup[];
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">Study Groups</h1>
            <p className="text-muted-foreground mt-2">
              Collaborate with other students in study groups
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Study Group</DialogTitle>
              </DialogHeader>
              <CreateStudyGroupForm onSuccess={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (!studyGroups || studyGroups.length === 0) ? (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No study groups yet</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                Create a group or join one using an invite code to start collaborating with other students
              </p>
              <Button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studyGroups.map((group) => (
              <Card
                key={group.id}
                className="group cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                onClick={() => navigate(`/study-groups/${group.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-4">
                    <span className="line-clamp-1">{group.name}</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-normal">
                      {group.subject}
                    </span>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {group.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>Shared Notes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(group.created_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudyGroups;
