
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Flashcards = () => {
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4 pt-20">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {decks?.map((deck) => (
              <Link to={`/flashcards/${deck.id}`} key={deck.id}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle>{deck.title}</CardTitle>
                    <CardDescription>
                      {deck.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{deck.total_cards} cards</span>
                      <span>{deck.learned_cards} learned</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Flashcards;
