
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";

const Notes = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen pt-6">
      <div className="container mx-auto max-w-[1400px] px-4 lg:px-8">
        <NotesContent />
      </div>
    </div>
  );
};

export default Notes;
