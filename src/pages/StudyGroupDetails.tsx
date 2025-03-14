
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

const StudyGroupDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { state } = useSidebar();
  const sidebarIsOpen = state === "expanded";
  const isMobile = useIsMobile();

  const { studyGroup, members, isLoading, error } = useStudyGroupData(id);

  if (isLoading) {
    return <LoadingState sidebarIsOpen={sidebarIsOpen} isMobile={isMobile} />;
  }

  if (error || !studyGroup) {
    console.error("Error loading study group:", error);
    return <ErrorState sidebarIsOpen={sidebarIsOpen} isMobile={isMobile} />;
  }

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
