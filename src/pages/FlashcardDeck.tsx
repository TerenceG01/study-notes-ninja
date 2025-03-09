
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookOpen, Pencil } from "lucide-react";
import { StudyMode } from "@/components/flashcards/StudyMode";
import { DeckHeader } from "@/components/flashcards/deck/DeckHeader";
import { ManageCards } from "@/components/flashcards/deck/ManageCards";
import { EmptyDeckView } from "@/components/flashcards/deck/EmptyDeckView";
import { DeckLoading } from "@/components/flashcards/deck/DeckLoading";
import { useSidebar } from "@/components/ui/sidebar";

const FlashcardDeck = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  
  const { data: deck, isLoading: isDeckLoading } = useQuery({
    queryKey: ['flashcard-deck', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('flashcard_decks').select('*').eq('id', id).eq('user_id', user?.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user
  });
  
  const { data: flashcards, isLoading: isFlashcardsLoading } = useQuery({
    queryKey: ['flashcards', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('flashcards').select('*').eq('deck_id', id).order('created_at', {
        ascending: true
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
  
  if (isDeckLoading || isFlashcardsLoading) {
    return <DeckLoading />;
  }
  
  if (!deck) {
    toast({
      variant: "destructive",
      title: "Deck not found",
      description: "The flashcard deck you're looking for doesn't exist or you don't have access to it."
    });
    navigate('/flashcards');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className={`transition-all duration-300 ${isOpen ? 'ml-40' : 'ml-20'} w-[calc(100%-theme(spacing.40))] max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 py-4`}>
        <DeckHeader title={deck.title} description={deck.description} />

        <Tabs defaultValue="study" className="space-y-6">
          <TabsList>
            <TabsTrigger value="study">
              <BookOpen className="h-4 w-4 mr-2" />
              Study
            </TabsTrigger>
            <TabsTrigger value="manage">
              <Pencil className="h-4 w-4 mr-2" />
              Manage Cards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="study" className="space-y-4">
            {flashcards && flashcards.length > 0 ? (
              isMobile ? (
                <div className="pb-16"> {/* Add padding to account for navigation */}
                  <StudyMode flashcards={flashcards} deckId={id!} />
                </div>
              ) : (
                <StudyMode flashcards={flashcards} deckId={id!} />
              )
            ) : (
              <EmptyDeckView />
            )}
          </TabsContent>

          <TabsContent value="manage">
            {flashcards && flashcards.length > 0 ? (
              <ManageCards flashcards={flashcards} deckId={id!} />
            ) : (
              <EmptyDeckView />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FlashcardDeck;
