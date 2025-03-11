
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2 } from "lucide-react";

interface DeckCardProps {
  deck: {
    id: string;
    title: string;
    description: string | null;
  };
  cardCount: number;
  onDelete: (deckId: string, event: React.MouseEvent) => void;
}

export const DeckCard = ({ deck, cardCount, onDelete }: DeckCardProps) => {
  return (
    <Link to={`/flashcards/${deck.id}`}>
      <Card className="h-full hover:bg-muted/50 transition-colors group">
        <CardHeader className="relative p-3 sm:p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => onDelete(deck.id, e)}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
          <CardTitle className="text-lg sm:text-xl mb-1 line-clamp-1">{deck.title}</CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {deck.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{cardCount || 0} cards</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
