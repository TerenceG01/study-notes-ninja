
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const Notes = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  
  if (!user) return null;
  
  return (
    <div className={cn(
      "h-full flex-grow overflow-x-hidden pt-6", 
      isOpen ? "ml-40" : "ml-20"
    )}>
      <div className="container mx-auto max-w-full px-4 lg:px-8 h-full overflow-hidden">
        <NotesContent />
      </div>
    </div>
  );
};

export default Notes;
