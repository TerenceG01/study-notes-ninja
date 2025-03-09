
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";

const Notes = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="h-full flex-grow w-full">
      <div className="container mx-auto max-w-[1400px] w-full px-0 sm:px-4 lg:px-8 h-full">
        <NotesContent />
      </div>
    </div>
  );
};

export default Notes;
