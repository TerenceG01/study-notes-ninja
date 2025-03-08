
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, X, Check, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ManageCardsProps {
  flashcards: any[];
  deckId: string;
}

export const ManageCards = ({ flashcards, deckId }: ManageCardsProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateFlashcardMutation = useMutation({
    mutationFn: async ({ id, question, answer }: {
      id: string;
      question: string;
      answer: string;
    }) => {
      const { error } = await supabase.from('flashcards').update({
        question,
        answer
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flashcards', deckId]
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
      const { error } = await supabase.from('flashcards').delete().eq('id', flashcardId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flashcards', deckId]
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
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {flashcards?.map(flashcard => (
        <Card key={flashcard.id} className="hover:bg-muted/50 transition-colors h-[300px] w-full flex-shrink-0">
          <CardContent className="pt-6 h-full flex flex-col">
            {editingId === flashcard.id ? (
              <div className="space-y-4 flex-1 overflow-auto">
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
              </div>
            ) : (
              <>
                <div className="mb-4 flex-1 overflow-auto">
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
                  <div className="overflow-auto max-h-[100px] text-muted-foreground">
                    {flashcard.question}
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <h3 className="font-medium mb-2">Answer:</h3>
                  <div className="overflow-auto max-h-[100px] text-muted-foreground">
                    {flashcard.answer}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
