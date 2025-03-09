
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

const Notes = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="h-full flex-grow w-full">
      <ResponsiveContainer withPadding={false} className="h-full">
        <NotesContent />
      </ResponsiveContainer>
    </div>
  );
};

export default Notes;
