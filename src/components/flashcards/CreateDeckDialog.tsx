
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export const CreateDeckDialog = ({ open, onOpenChange, userId }: CreateDeckDialogProps) => {
  const [newDeck, setNewDeck] = useState({ title: "", description: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDeckMutation = useMutation({
    mutationFn: async (values: { title: string; description: string }) => {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .insert([
          {
            title: values.title,
            description: values.description,
            user_id: userId,
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
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onOpenChange(false);
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
  );
};
