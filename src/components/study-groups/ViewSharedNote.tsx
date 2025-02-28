
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

  console.log("ViewSharedNote rendered with:", { open, noteId: note?.id });

  const updateNoteMutation = useMutation({
    mutationFn: async () => {
      console.log("Updating note with ID:", note.id);
      const { error } = await supabase
        .from('notes')
        .update({ content })
        .eq('id', note.id);

      if (error) {
        console.error("Error updating note:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Note updated successfully");
      queryClient.invalidateQueries({ queryKey: ['group-shared-notes'] });
      setIsEditing(false);
      toast({
        title: "Note updated",
        description: "The note has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Error in update mutation:", error);
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: error.message,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-h-[90vh] p-4 md:p-6 md:w-[80vw] lg:w-[60vw] xl:w-[800px] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl md:text-2xl">{note.title}</DialogTitle>
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
        <div className="mt-4 md:mt-6">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] md:min-h-[300px] lg:min-h-[400px]"
            />
          ) : (
            <div className="whitespace-pre-wrap prose max-w-none">{content}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
