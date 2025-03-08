
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DeckHeaderProps {
  title: string;
  description: string | null;
}

export const DeckHeader = ({ title, description }: DeckHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <Button variant="ghost" onClick={() => navigate('/flashcards')} className="mb-6 px-[20px]">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Decks
      </Button>

      <div className="mb-8 px-[16px]">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description || "No description"}</p>
      </div>
    </>
  );
};
