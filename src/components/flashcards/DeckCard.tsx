
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
        <CardHeader className="relative p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => onDelete(deck.id, e)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          <CardTitle className="text-2xl mb-2 line-clamp-1">{deck.title}</CardTitle>
          <CardDescription className="text-base line-clamp-2">
            {deck.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-base text-muted-foreground">
            <BookOpen className="h-5 w-5" />
            <span>{cardCount || 0} cards</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
