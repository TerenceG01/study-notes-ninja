
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, X } from "lucide-react";
import { RichTextEditor } from "@/components/notes/editor/RichTextEditor";

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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 z-10"
          aria-label="Close shared note"
        >
          <X className="h-4 w-4" />
        </Button>
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
            <RichTextEditor
              content={content}
              onChange={setContent}
              className="min-h-[200px] md:min-h-[300px] lg:min-h-[400px]"
              placeholder="Edit note content..."
            />
          ) : (
            <div className="prose prose-sm sm:prose max-w-none p-2 sm:p-4 border rounded-md bg-white dark:bg-gray-950">
              <div 
                className="ProseMirror prose-sm sm:prose max-w-none focus:outline-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-primary prose-p:my-2 prose-ul:pl-6 prose-ol:pl-6"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
