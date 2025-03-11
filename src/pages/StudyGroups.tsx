
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { CreateStudyGroupForm } from "@/components/study-groups/CreateStudyGroupForm";
import { EmptyGroupState } from "@/components/study-groups/EmptyGroupState";
import { StudyGroupCard } from "@/components/study-groups/StudyGroupCard";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { state } = useSidebar();
  const sidebarIsOpen = state === "expanded";
  const isMobile = useIsMobile();

  const { data: studyGroups, isLoading, error } = useQuery({
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
    retry: 1,
    staleTime: 1000 * 60 * 5
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className={cn(
      "h-full flex-grow overflow-hidden pt-6",
      sidebarIsOpen ? "ml-40" : "ml-20",
      isMobile && "ml-0 pb-16" // Remove sidebar margin and add bottom padding for mobile nav
    )}>
      <ResponsiveContainer>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Study Groups</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Collaborate with other students in study groups
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 self-start">
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
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive mb-4">Error loading study groups</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : !studyGroups || studyGroups.length === 0 ? (
            <EmptyGroupState onCreateClick={() => setIsOpen(true)} />
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto overflow-x-hidden pb-4">
              {studyGroups.map(group => (
                <StudyGroupCard 
                  key={group.id} 
                  group={group} 
                  onClick={() => navigate(`/study-groups/${group.id}`)} 
                />
              ))}
            </div>
          )}
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default StudyGroups;
