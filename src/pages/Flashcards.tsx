
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
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { useIsMobile } from "@/hooks/use-mobile";

const Flashcards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();

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
    <div className={cn(
      "h-full flex-grow overflow-hidden pt-6",
      isOpen ? "ml-40" : "ml-20",
      isMobile && "ml-0 pb-16" // Remove sidebar margin and add bottom padding for mobile nav
    )}>
      <ResponsiveContainer>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-primary">My Flashcards</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Create and review flashcards to improve retention</p>
            </div>
          </div>

          {isLoading ? (
            <NotesGridSkeleton count={3} />
          ) : !decks || decks.length === 0 ? (
            <EmptyDeckState onCreateClick={() => setOpenCreateDialog(true)} />
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto overflow-x-hidden pb-4">
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
      </ResponsiveContainer>
    </div>
  );
};

export default Flashcards;
