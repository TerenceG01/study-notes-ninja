
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NotesContent } from "@/components/notes/NotesContent";
import { NotesHeader } from "@/components/notes/NotesHeader";
import { NotesActionCards } from "@/components/notes/NotesActionCards";

const Notes = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const isOpen = state === "expanded";

  if (!user) return null;

  return (
    <div className={cn(
      "px-6 py-6",
      "transition-all duration-300",
      isOpen ? "ml-[10px]" : "ml-[24px]",
      "w-[calc(100vw-theme(spacing.40)-10px)]",
      !isOpen && "w-[calc(100vw-theme(spacing.20)-24px)]",
    )}>
      <div className="mx-auto max-w-[min(100%,64rem)] space-y-4">
        <NotesHeader onSearch={(query) => console.log('Search:', query)} />
        <NotesActionCards onCreateNote={() => {}} />
      </div>
      <NotesContent />
    </div>
  );
};

export default Notes;
