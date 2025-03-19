
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
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
          <div className="flex flex-col gap-1">
            <CardTitle className={`line-clamp-2 ${isMobile ? "text-base" : "text-lg sm:text-xl"} font-semibold text-primary`}>
              {deck.title}
            </CardTitle>
          </div>
          <CardDescription className={`line-clamp-${isMobile ? "1" : "2"} text-xs sm:text-sm mt-1`}>
            {deck.description || t("noDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? "p-3 pt-0" : "p-4 pt-0"} mt-auto`}>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{cardCount || 0} {t("cards")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
