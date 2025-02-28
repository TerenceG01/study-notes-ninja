
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Pencil, X, Check, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StudyMode } from "@/components/flashcards/StudyMode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const FlashcardDeck = () => {
  const {
    id
  } = useParams();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const {
    data: deck,
    isLoading: isDeckLoading
  } = useQuery({
    queryKey: ['flashcard-deck', id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('flashcard_decks').select('*').eq('id', id).eq('user_id', user?.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user
  });
  const {
    data: flashcards,
    isLoading: isFlashcardsLoading
  } = useQuery({
    queryKey: ['flashcards', id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('flashcards').select('*').eq('deck_id', id).order('created_at', {
        ascending: true
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
  const updateFlashcardMutation = useMutation({
    mutationFn: async ({
      id,
      question,
      answer
    }: {
      id: string;
      question: string;
      answer: string;
    }) => {
      const {
        error
      } = await supabase.from('flashcards').update({
        question,
        answer
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flashcards', id]
      });
      toast({
        title: "Flashcard updated",
        description: "Your changes have been saved successfully."
      });
      setEditingId(null);
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Error updating flashcard",
        description: error.message
      });
    }
  });
  const deleteFlashcardMutation = useMutation({
    mutationFn: async (flashcardId: string) => {
      const {
        error
      } = await supabase.from('flashcards').delete().eq('id', flashcardId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flashcards', id]
      });
      toast({
        title: "Flashcard deleted",
        description: "The flashcard has been removed successfully."
      });
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Error deleting flashcard",
        description: error.message
      });
    }
  });
  const startEditing = (flashcard: any) => {
    setEditingId(flashcard.id);
    setEditedQuestion(flashcard.question);
    setEditedAnswer(flashcard.answer);
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditedQuestion("");
    setEditedAnswer("");
  };
  const handleSave = async (id: string) => {
    if (!editedQuestion.trim() || !editedAnswer.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Question and answer cannot be empty."
      });
      return;
    }
    updateFlashcardMutation.mutate({
      id,
      question: editedQuestion,
      answer: editedAnswer
    });
  };
  const handleDelete = async (flashcardId: string) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      deleteFlashcardMutation.mutate(flashcardId);
    }
  };
  if (isDeckLoading || isFlashcardsLoading) {
    return <div className="min-h-screen bg-background">
        <NavigationBar />
        <main className="container mx-auto px-4 pt-20">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>;
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
  return <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4 sm:px-6 py-4">
        <Button variant="ghost" onClick={() => navigate('/flashcards')} className="mb-6 px-[20px]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Decks
        </Button>

        <div className="mb-8 px-[16px]">
          <h1 className="text-4xl font-bold">{deck.title}</h1>
          <p className="text-muted-foreground mt-2">{deck.description || "No description"}</p>
        </div>

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
            {flashcards && flashcards.length > 0 ? <StudyMode flashcards={flashcards} deckId={id!} /> : <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No flashcards yet</p>
                  <p className="text-muted-foreground mb-4">
                    Add some flashcards to start studying
                  </p>
                </CardContent>
              </Card>}
          </TabsContent>

          <TabsContent value="manage">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flashcards?.map(flashcard => <Card key={flashcard.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6">
                    {editingId === flashcard.id ? <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Question:</h3>
                          <Input value={editedQuestion} onChange={e => setEditedQuestion(e.target.value)} placeholder="Enter question" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Answer:</h3>
                          <Textarea value={editedAnswer} onChange={e => setEditedAnswer(e.target.value)} placeholder="Enter answer" />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="ghost" size="sm" onClick={cancelEditing}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSave(flashcard.id)} disabled={updateFlashcardMutation.isPending}>
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div> : <>
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">Question:</h3>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => startEditing(flashcard)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(flashcard.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{flashcard.question}</p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Answer:</h3>
                          <p className="text-muted-foreground">{flashcard.answer}</p>
                        </div>
                      </>}
                  </CardContent>
                </Card>)}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default FlashcardDeck;
