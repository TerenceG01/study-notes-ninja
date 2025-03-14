
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

interface ErrorStateProps {
  sidebarIsOpen: boolean;
  isMobile: boolean;
}

export const ErrorState = ({ sidebarIsOpen, isMobile }: ErrorStateProps) => {
  return (
    <div className={cn(
      "h-full flex-grow overflow-hidden pt-4 sm:pt-6",
      sidebarIsOpen ? "ml-40" : "ml-20",
      isMobile && "ml-0 pb-16" // Remove sidebar margin and add bottom padding for mobile nav
    )}>
      <ResponsiveContainer withPadding={!isMobile}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Study Group Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The study group you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </ResponsiveContainer>
    </div>
  );
};
