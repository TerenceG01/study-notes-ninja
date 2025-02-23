import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { EmptyDeckState } from "@/components/flashcards/EmptyDeckState";
import { CreateDeckDialog } from "@/components/flashcards/CreateDeckDialog";
import { DeckCard } from "@/components/flashcards/DeckCard";

const Flashcards = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const {
    state
  } = useSidebar();
  const isExpanded = state === "expanded";
  const {
    data: decks,
    isLoading
  } = useQuery({
    queryKey: ['flashcard-decks', user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('flashcard_decks').select('*').eq('user_id', user?.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  const deleteDeckMutation = useMutation({
    mutationFn: async (deckId: string) => {
      const {
        error
      } = await supabase.from('flashcard_decks').delete().eq('id', deckId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flashcard-decks']
      });
      toast({
        title: "Success",
        description: "Flashcard deck deleted successfully"
      });
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  });
  const handleDelete = async (deckId: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this deck? All flashcards in this deck will be deleted.')) {
      deleteDeckMutation.mutate(deckId);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="mx-0 my-0 px-0 py-0">
        <div className="flex justify-between items-start mb-8 px-[24px] py-[24px] animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div>
            <h1 className="text-4xl font-bold text-primary">My Flashcards</h1>
            <p className="text-muted-foreground mt-2">Review and manage your flashcard decks</p>
          </div>
          <Button onClick={() => setIsCreatingDeck(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Deck
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : decks?.length === 0 ? (
          <EmptyDeckState onCreateClick={() => setIsCreatingDeck(true)} className="px-[15px] mx-[10px]" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-[fadeSlideIn_0.5s_ease-out_200ms_forwards]">
            {decks?.map(deck => <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} />)}
          </div>
        )}

        {user && <CreateDeckDialog open={isCreatingDeck} onOpenChange={setIsCreatingDeck} userId={user.id} />}
      </main>
    </div>
  );
};

export default Flashcards;
