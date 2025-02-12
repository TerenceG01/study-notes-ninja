
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";

interface ViewSharedNoteProps {
  note: {
    id: string;
    title: string;
    content: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewSharedNote = ({ note, open, onOpenChange }: ViewSharedNoteProps) => {
  const [content, setContent] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateNoteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notes')
        .update({ content })
        .eq('id', note.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-shared-notes'] });
      setIsEditing(false);
      toast({
        title: "Note updated",
        description: "The note has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: error.message,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
          <div className="flex justify-end space-x-2">
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                Edit Note
              </Button>
            )}
            {isEditing && (
              <Button
                onClick={() => updateNoteMutation.mutate()}
                disabled={updateNoteMutation.isPending}
              >
                {updateNoteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            )}
          </div>
        </DialogHeader>
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px]"
          />
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
