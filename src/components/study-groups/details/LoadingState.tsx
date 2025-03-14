
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

interface LoadingStateProps {
  sidebarIsOpen: boolean;
  isMobile: boolean;
}

export const LoadingState = ({ sidebarIsOpen, isMobile }: LoadingStateProps) => {
  return (
    <div className={cn(
      "h-full flex-grow overflow-hidden pt-4 sm:pt-6",
      sidebarIsOpen ? "ml-40" : "ml-20",
      isMobile && "ml-0 pb-16" // Remove sidebar margin and add bottom padding for mobile nav
    )}>
      <ResponsiveContainer withPadding={!isMobile}>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ResponsiveContainer>
    </div>
  );
};
