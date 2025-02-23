
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { NotesContent } from "@/components/notes/NotesContent";

const Notes = () => {
  const { user } = useAuth();
  const { state } = useSidebar();

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[min(100%,64rem)] space-y-4 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
        <NotesContent />
      </div>
    </div>
  );
};

export default Notes;
