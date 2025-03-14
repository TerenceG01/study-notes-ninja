
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, BookOpen, Users } from "lucide-react";
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
  member_count?: number;
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
      
      const { data: groups, error: groupsError } = await supabase.rpc('get_user_study_groups', {
        p_user_id: user.id
      });
      
      if (groupsError) throw groupsError;
      
      if (!groups || groups.length === 0) return [];
      
      const groupsWithMemberCount = await Promise.all(
        groups.map(async (group) => {
          const { data: members, error: countError } = await supabase
            .from('study_group_members')
            .select('*')
            .eq('group_id', group.id);
          
          if (countError) {
            console.error("Error fetching member count:", countError);
            return {
              ...group,
              member_count: 0
            };
          }
          
          return {
            ...group,
            member_count: members ? members.length : 0
          };
        })
      );
      
      console.log("Groups with member count:", groupsWithMemberCount);
      return groupsWithMemberCount as StudyGroup[];
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
      "h-full flex-grow overflow-hidden pt-4 sm:pt-6",
      sidebarIsOpen ? "ml-40" : "ml-20",
      isMobile && "ml-0 pb-20"
    )}>
      <ResponsiveContainer withPadding={!isMobile}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-primary flex items-center gap-2">
                <Users className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                Study Groups
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Collaborate with other students in interactive study groups
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 text-sm h-9 sm:h-10 px-3 sm:px-4 self-start 
                               hover:scale-105 transition-transform duration-200">
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
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading your study groups...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <p className="text-destructive mb-4">Error loading study groups</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : !studyGroups || studyGroups.length === 0 ? (
            <EmptyGroupState onCreateClick={() => setIsOpen(true)} />
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 overflow-y-auto pb-8 animate-fade-in">
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
