
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

interface EmptyDeckStateProps {
  onCreateClick: () => void;
}

export const EmptyDeckState = ({ onCreateClick }: EmptyDeckStateProps) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <BookOpen className="h-16 w-16 text-muted-foreground mb-6" />
        <p className="text-xl font-medium mb-3">No flashcard decks yet</p>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Create flashcards from your notes to start studying
        </p>
        <Button
          onClick={onCreateClick}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Your First Deck
        </Button>
      </CardContent>
    </Card>
  );
};
