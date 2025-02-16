
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { CreateStudyGroupForm } from "@/components/study-groups/CreateStudyGroupForm";
import { EmptyGroupState } from "@/components/study-groups/EmptyGroupState";
import { StudyGroupCard } from "@/components/study-groups/StudyGroupCard";

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
          <EmptyGroupState onCreateClick={() => setIsOpen(true)} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studyGroups.map((group) => (
              <StudyGroupCard
                key={group.id}
                group={group}
                onClick={() => navigate(`/study-groups/${group.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudyGroups;
