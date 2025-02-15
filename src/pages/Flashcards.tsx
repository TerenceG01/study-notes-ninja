import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Trash2, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Flashcards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [newDeck, setNewDeck] = useState({ title: "", description: "" });

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

  const createDeckMutation = useMutation({
    mutationFn: async (values: { title: string; description: string }) => {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .insert([
          {
            title: values.title,
            description: values.description,
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcard-decks'] });
      toast({
        title: "Success",
        description: "Flashcard deck created successfully",
      });
      setIsCreatingDeck(false);
      setNewDeck({ title: "", description: "" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
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

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeck.title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a deck title",
      });
      return;
    }
    createDeckMutation.mutate(newDeck);
  };

  const handleDelete = async (deckId: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this deck? All flashcards in this deck will be deleted.')) {
      deleteDeckMutation.mutate(deckId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="px-0 py-6 -ml-8">
        <div className="flex justify-between items-start mb-8 px-4">
          <div>
            <h1 className="text-4xl font-bold text-primary">My Flashcards</h1>
            <p className="text-muted-foreground mt-2">Review and manage your flashcard decks</p>
          </div>
          <Button
            onClick={() => setIsCreatingDeck(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Deck
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : decks?.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-6" />
              <p className="text-xl font-medium mb-3">No flashcard decks yet</p>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Create flashcards from your notes to start studying
              </p>
              <Button
                onClick={() => setIsCreatingDeck(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Deck
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {decks?.map((deck) => (
              <Link to={`/flashcards/${deck.id}`} key={deck.id}>
                <Card className="h-full hover:bg-muted/50 transition-colors group">
                  <CardHeader className="relative p-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDelete(deck.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <CardTitle className="text-2xl mb-2 line-clamp-1">{deck.title}</CardTitle>
                    <CardDescription className="text-base line-clamp-2">
                      {deck.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex items-center gap-2 text-base text-muted-foreground">
                      <BookOpen className="h-5 w-5" />
                      <span>{deck.total_cards || 0} cards</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <Dialog open={isCreatingDeck} onOpenChange={setIsCreatingDeck}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Flashcard Deck</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateDeck} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newDeck.title}
                  onChange={(e) => setNewDeck({ ...newDeck, title: e.target.value })}
                  placeholder="Enter deck title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newDeck.description}
                  onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  placeholder="Enter deck description"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreatingDeck(false);
                    setNewDeck({ title: "", description: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createDeckMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {createDeckMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Deck
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Flashcards;
