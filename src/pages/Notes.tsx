
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
      "px-[10px] py-[10px] my-[55px]",
      isOpen ? "mx-[50px]" : "mx-[20px]"
    )}>
      <div className="mx-auto max-w-[min(100%,64rem)] space-y-4">
        <NotesHeader onSearch={query => console.log('Search:', query)} />
        <NotesActionCards onCreateNote={() => {}} />
        <NotesContent />
      </div>
    </div>
  );
};

export default Notes;
