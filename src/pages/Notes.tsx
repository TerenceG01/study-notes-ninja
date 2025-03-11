
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

const Notes = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();
  
  if (!user) return null;
  
  return (
    <div className={cn(
      "h-[calc(100vh-60px)] overflow-hidden pt-0", // Reduced height calculation from 64px to 60px
      isOpen ? "ml-0 md:ml-40" : "ml-0 md:ml-20",
      isMobile && "ml-0 pb-2 h-[calc(100vh-80px)]" // Reduced padding and height calculation
    )}>
      <ResponsiveContainer className="h-full max-h-full pb-0 overflow-hidden">
        <NotesContent />
      </ResponsiveContainer>
    </div>
  );
};

export default Notes;
