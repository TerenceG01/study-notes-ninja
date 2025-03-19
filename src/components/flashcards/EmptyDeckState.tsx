
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyDeckStateProps {
  onCreateClick: () => void;
  className?: string;
}

export const EmptyDeckState = ({ onCreateClick, className }: EmptyDeckStateProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className={cn("bg-muted/50", className)}>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <BookOpen className="h-16 w-16 text-muted-foreground mb-6" />
        <p className="text-xl font-medium mb-3">{t("noFlashcardDecks")}</p>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          {t("createFlashcardsFromNotes")}
        </p>
        <Button
          onClick={onCreateClick}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("createFirstDeck")}
        </Button>
      </CardContent>
    </Card>
  );
};
