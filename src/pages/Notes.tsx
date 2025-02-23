
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NotesContent } from "@/components/notes/NotesContent";
import { useNoteEditor } from "@/hooks/useNoteEditor";

const Notes = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const { setIsEditorExpanded } = useNoteEditor();
  const isOpen = state === "expanded";

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[min(100%,64rem)] space-y-4">
        <NotesContent />
      </div>
    </div>
  );
};

export default Notes;
