
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { LoadingState } from "@/components/study-groups/details/LoadingState";
import { ErrorState } from "@/components/study-groups/details/ErrorState";
import { StudyGroupContent } from "@/components/study-groups/details/StudyGroupContent";
import { useStudyGroupData } from "@/hooks/useStudyGroupData";
import { useEffect } from "react";

const StudyGroupDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { state } = useSidebar();
  const sidebarIsOpen = state === "expanded";
  const isMobile = useIsMobile();

  const { studyGroup, members, isLoading, error, refetchGroup } = useStudyGroupData(id);
  
  // Set up a regular refetch interval for extra reliability
  useEffect(() => {
    // Initial fetch on mount
    if (!isLoading && !error) {
      refetchGroup();
    }
    
    // Refetch regularly
    const intervalId = setInterval(() => {
      if (!isLoading && !error) {
        refetchGroup();
      }
    }, 5000); // Every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [refetchGroup, isLoading, error]);

  if (isLoading) {
    return <LoadingState sidebarIsOpen={sidebarIsOpen} isMobile={isMobile} />;
  }

  if (error || !studyGroup) {
    console.error("Error loading study group:", error);
    return <ErrorState sidebarIsOpen={sidebarIsOpen} isMobile={isMobile} />;
  }

  console.log("StudyGroupDetails rendering with study group:", studyGroup);
  console.log("Description in details page:", studyGroup.description);

  const userRole = members?.find(member => member.user_id === user?.id)?.role;

  return (
    <div className={cn(
      "h-full flex-grow overflow-hidden pt-4 sm:pt-6",
      sidebarIsOpen ? "ml-40" : "ml-20",
      isMobile && "ml-0 pb-16" // Remove sidebar margin and add bottom padding for mobile nav
    )}>
      <ResponsiveContainer withPadding={!isMobile}>
        <StudyGroupContent 
          studyGroup={studyGroup}
          members={members || []}
          userRole={userRole}
          userId={user?.id}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default StudyGroupDetails;
