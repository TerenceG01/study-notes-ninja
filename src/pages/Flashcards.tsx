
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CreateDeckDialog } from "@/components/flashcards/CreateDeckDialog";
import { DeckCard } from "@/components/flashcards/DeckCard";
import { EmptyDeckState } from "@/components/flashcards/EmptyDeckState";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotesGridSkeleton } from "@/components/ui/loading-skeletons";

const Flashcards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const { data: decks, isLoading, refetch } = useQuery({
    queryKey: ["flashcard-decks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flashcard_decks")
        .select("*, flashcards(count)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const handleDeleteDeck = async (deckId: string) => {
    try {
      // First delete all flashcards in the deck
      const { error: flashcardsError } = await supabase
        .from("flashcards")
        .delete()
        .eq("deck_id", deckId);
      
      if (flashcardsError) throw flashcardsError;
      
      // Then delete the deck itself
      const { error: deckError } = await supabase
        .from("flashcard_decks")
        .delete()
        .eq("id", deckId);
      
      if (deckError) throw deckError;
      
      refetch();
      
      toast({
        title: "Deck deleted",
        description: "The flashcard deck has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting deck:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the deck. Please try again.",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-[1400px] px-4 lg:px-8 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <Button 
          onClick={() => setOpenCreateDialog(true)}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          New Deck
        </Button>
      </div>

      {isLoading ? (
        <NotesGridSkeleton count={3} />
      ) : !decks || decks.length === 0 ? (
        <EmptyDeckState onCreate={() => setOpenCreateDialog(true)} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              cardCount={(deck.flashcards as any)?.[0]?.count || 0}
              onDeleteDeck={() => handleDeleteDeck(deck.id)}
            />
          ))}
        </div>
      )}

      <CreateDeckDialog 
        open={openCreateDialog} 
        onOpenChange={setOpenCreateDialog}
        onDeckCreated={() => {
          refetch();
          setOpenCreateDialog(false);
        }}
      />
    </div>
  );
};

export default Flashcards;
