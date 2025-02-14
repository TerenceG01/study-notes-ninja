
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Flashcards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: decks, isLoading } = useQuery({
    queryKey: ['flashcard-decks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteDeckMutation = useMutation({
    mutationFn: async (deckId: string) => {
      const { error } = await supabase
        .from('flashcard_decks')
        .delete()
        .eq('id', deckId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcard-decks'] });
      toast({
        title: "Success",
        description: "Flashcard deck deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleDelete = async (deckId: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this deck? All flashcards in this deck will be deleted.')) {
      deleteDeckMutation.mutate(deckId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Flashcards</h1>
        <p className="text-muted-foreground mt-2">Review and manage your flashcard decks</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : decks?.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No flashcard decks yet</p>
            <p className="text-muted-foreground mb-4">
              Create flashcards from your notes to start studying
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {decks?.map((deck) => (
            <Link to={`/flashcards/${deck.id}`} key={deck.id}>
              <Card className="hover:bg-muted/50 transition-colors group h-full">
                <CardHeader className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDelete(deck.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <CardTitle>{deck.title}</CardTitle>
                  <CardDescription>
                    {deck.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {deck.total_cards} cards
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
