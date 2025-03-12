
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface DeckHeaderProps {
  title: string;
  description: string | null;
}

export const DeckHeader = ({ title, description }: DeckHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-6 w-full">
      <Button variant="ghost" onClick={() => navigate('/flashcards')} className="mb-4 px-2 -ml-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Decks
      </Button>

      <div className="mb-6">
        <h1 className={`${isMobile ? "text-2xl" : "text-3xl sm:text-4xl"} font-bold text-primary line-clamp-2`}>{title}</h1>
        <p className="text-muted-foreground mt-2 line-clamp-2">{description || "No description"}</p>
      </div>
    </div>
  );
};
