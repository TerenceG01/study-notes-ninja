
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateDeckDialog } from "@/components/flashcards/CreateDeckDialog";
import { DeckCard } from "@/components/flashcards/DeckCard";
import { EmptyDeckState } from "@/components/flashcards/EmptyDeckState";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { NotesGridSkeleton } from "@/components/ui/loading-skeletons";
import { useSidebar } from "@/components/ui/sidebar";

const Flashcards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
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
    <div className={`transition-all duration-300 ${isOpen ? 'ml-40' : 'ml-20'} w-full px-4 sm:px-6 lg:px-8 pt-6`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-primary">My Flashcards</h1>
          <p className="text-muted-foreground">Create and review flashcards to improve retention</p>
        </div>
      </div>

      {isLoading ? (
        <NotesGridSkeleton count={3} />
      ) : !decks || decks.length === 0 ? (
        <EmptyDeckState onCreateClick={() => setOpenCreateDialog(true)} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              cardCount={(deck.flashcards as any)?.[0]?.count || 0}
              onDelete={(deckId, e) => {
                e.preventDefault(); // Prevent navigation
                handleDeleteDeck(deckId);
              }}
            />
          ))}
        </div>
      )}

      <CreateDeckDialog 
        open={openCreateDialog} 
        onOpenChange={setOpenCreateDialog}
        onDeckCreated={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default Flashcards;
