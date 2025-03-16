
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookOpen, Pencil, Search } from "lucide-react";
import { StudyMode } from "@/components/flashcards/StudyMode";
import { DeckHeader } from "@/components/flashcards/deck/DeckHeader";
import { ManageCards } from "@/components/flashcards/deck/ManageCards";
import { EmptyDeckView } from "@/components/flashcards/deck/EmptyDeckView";
import { DeckLoading } from "@/components/flashcards/deck/DeckLoading";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const FlashcardDeck = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const [searchTerm, setSearchTerm] = useState("");
  
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
  
  // Filter flashcards for the manage tab
  const filteredFlashcards = flashcards?.filter(card => 
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
    <div className={cn(
      "h-full flex-grow overflow-hidden pt-6 w-full",
      isOpen ? "ml-40" : "ml-20",
      isMobile && "ml-0 pb-16" // Remove sidebar margin and add bottom padding for mobile nav
    )}>
      <ResponsiveContainer fullWidth className="pr-0 w-full mx-0">
        <DeckHeader title={deck.title} description={deck.description} />

        <Tabs defaultValue="study" className="space-y-3 sm:space-y-4 overflow-hidden w-full">
          <TabsList className="w-full max-w-[280px] mx-auto">
            <TabsTrigger value="study" className="flex-1 text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Study
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex-1 text-xs sm:text-sm">
              <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Manage Cards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="study" className="space-y-4 overflow-hidden w-full">
            {flashcards && flashcards.length > 0 ? (
              <div className="overflow-x-hidden w-full">
                <StudyMode flashcards={flashcards} deckId={id!} />
              </div>
            ) : (
              <EmptyDeckView />
            )}
          </TabsContent>

          <TabsContent value="manage" className="overflow-hidden w-full">
            {flashcards && flashcards.length > 0 ? (
              <>
                <div className="mb-4 relative w-full">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search cards..."
                      className="pl-9 h-9 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <ManageCards flashcards={filteredFlashcards || []} deckId={id!} />
              </>
            ) : (
              <EmptyDeckView />
            )}
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </div>
  );
};

export default FlashcardDeck;
