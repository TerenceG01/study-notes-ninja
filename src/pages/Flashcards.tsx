
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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Flashcards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter decks based on search term
  const filteredDecks = decks?.filter(deck => 
    deck.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className={cn(
      "h-full flex-grow overflow-hidden pt-6",
      isOpen ? "ml-40" : "ml-20",
      isMobile && "ml-0 pb-16" // Remove sidebar margin and add bottom padding for mobile nav
    )}>
      <ResponsiveContainer>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-primary">My Flashcards</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Create and review flashcards to improve retention</p>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="mb-4 relative">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search decks..."
                className="pl-9 h-10 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <NotesGridSkeleton count={3} />
          ) : !filteredDecks || filteredDecks.length === 0 ? (
            searchTerm && decks?.length > 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No decks found matching "{searchTerm}"</p>
              </div>
            ) : (
              <EmptyDeckState onCreateClick={() => setOpenCreateDialog(true)} />
            )
          ) : (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto overflow-x-hidden pb-4">
              {filteredDecks.map((deck) => (
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
