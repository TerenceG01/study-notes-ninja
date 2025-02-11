
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const FlashcardDeck = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: deck, isLoading: isDeckLoading } = useQuery({
    queryKey: ['flashcard-deck', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const { data: flashcards, isLoading: isFlashcardsLoading } = useQuery({
    queryKey: ['flashcards', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('deck_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isDeckLoading || isFlashcardsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <main className="container mx-auto px-4 pt-20">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!deck) {
    toast({
      variant: "destructive",
      title: "Deck not found",
      description: "The flashcard deck you're looking for doesn't exist or you don't have access to it.",
    });
    navigate('/flashcards');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4 pt-20">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/flashcards')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Decks
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">{deck.title}</h1>
          <p className="text-muted-foreground mt-2">{deck.description || "No description"}</p>
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <span>{deck.total_cards} cards</span>
            <span>{deck.learned_cards} learned</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {flashcards?.map((flashcard) => (
            <Card key={flashcard.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Question:</h3>
                  <p className="text-muted-foreground">{flashcard.question}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Answer:</h3>
                  <p className="text-muted-foreground">{flashcard.answer}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FlashcardDeck;
