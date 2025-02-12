
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
import { Loader2, Plus, Users } from "lucide-react";
import { CreateStudyGroupForm } from "@/components/study-groups/CreateStudyGroupForm";

const StudyGroups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { data: studyGroups, isLoading } = useQuery({
    queryKey: ['study-groups'],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      // Use a stored procedure to get user's study groups
      const { data: groups, error } = await supabase
        .rpc('get_user_study_groups', {
          p_user_id: user.id
        });

      if (error) throw error;
      return groups;
    },
    enabled: !!user,
  });

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4 pt-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Study Groups</h1>
            <p className="text-muted-foreground mt-2">
              Collaborate with other students in study groups
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studyGroups?.map((group) => (
            <Card
              key={group.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/study-groups/${group.id}`)}
            >
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {group.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </div>
              </CardContent>
            </Card>
          ))}

          {studyGroups?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No study groups yet</h3>
              <p className="text-muted-foreground mb-4">
                Create a group or join one using an invite code
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudyGroups;
