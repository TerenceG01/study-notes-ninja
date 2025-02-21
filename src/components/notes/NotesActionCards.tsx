
import { Plus, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface NotesActionCardsProps {
  onCreateNote: () => void;
}

export const NotesActionCards = ({ onCreateNote }: NotesActionCardsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      <Card 
        className="bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-colors cursor-pointer group"
        onClick={onCreateNote}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary/20 transition-colors">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="mb-2">Create New Note</CardTitle>
          <CardDescription>Add a new note to your collection</CardDescription>
        </CardContent>
      </Card>

      <Card 
        className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/20 transition-colors cursor-pointer"
        onClick={() => navigate('/flashcards')}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
          <div className="rounded-full bg-blue-500/10 p-4 mb-4">
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle className="mb-2">Recent Flashcards</CardTitle>
          <CardDescription>View your flashcard decks</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};
