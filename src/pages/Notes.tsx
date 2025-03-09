
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";

const Notes = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="h-full flex-grow">
      <NotesContent />
    </div>
  );
};

export default Notes;
