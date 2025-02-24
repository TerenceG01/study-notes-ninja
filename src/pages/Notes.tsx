
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";

const Notes = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-4 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
        <NotesContent />
      </div>
    </div>
  );
};

export default Notes;
