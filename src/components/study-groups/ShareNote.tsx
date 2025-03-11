import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Loader2, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface ShareNoteProps {
  groupId: string;
}

export const ShareNote = ({ groupId }: ShareNoteProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Reset pointer events when dialog closes
  useEffect(() => {
    if (!open) {
      resetPointerEvents();
    }
    return () => {
      resetPointerEvents();
    };
  }, [open]);

  const resetPointerEvents = () => {
    // Reset pointer-events on body and html
    document.body.style.pointerEvents = '';
    document.documentElement.style.pointerEvents = '';
    
    // Reset all elements with pointer-events style
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      if (element instanceof HTMLElement && element.style.pointerEvents === 'none') {
        element.style.pointerEvents = '';
      }
    });
    
    // Force repaint
    document.body.getBoundingClientRect();
  };

  console.log('ShareNote rendered with groupId:', groupId); // Debug log

  const { data: notes, isLoading: loadingNotes } = useQuery({
    queryKey: ['user-notes', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('id, title, content, created_at')
        .eq('user_id', user?.id);

      if (error) throw error;
      console.log("User notes fetched:", data?.length);
      return data as Note[];
    },
    enabled: !!user,
  });

  const { data: sharedNotes, isLoading: loadingSharedNotes } = useQuery({
    queryKey: ['shared-notes', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      console.log("Fetching already shared notes for group:", groupId);
      const { data, error } = await supabase
        .from('study_group_notes')
        .select('note_id')
        .eq('group_id', groupId);

      if (error) throw error;
      console.log("Already shared notes:", data.map(n => n.note_id));
      return data.map(n => n.note_id);
    },
    enabled: !!groupId && !!user,
  });

  const { data: maxOrder } = useQuery({
    queryKey: ['max-note-order', groupId],
    queryFn: async () => {
      if (!groupId) return 0;
      console.log("Fetching max order for group:", groupId);
      const { data, error } = await supabase
        .from('study_group_notes')
        .select('display_order')
        .eq('group_id', groupId)
        .order('display_order', { ascending: false })
        .limit(1);

      if (error) throw error;
      const maxOrder = data.length > 0 ? data[0].display_order : 0;
      console.log("Max order:", maxOrder);
      return maxOrder;
    },
    enabled: !!groupId && !!user,
  });

  const shareNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      if (!groupId || !user?.id) {
        throw new Error('Cannot share note: Missing required data');
      }

      const nextOrder = (maxOrder || 0) + 1;
      console.log("Sharing note with order:", nextOrder);

      const insertData = {
        group_id: groupId,
        note_id: noteId,
        shared_by: user.id,
        display_order: nextOrder,
      };
      
      console.log('Sharing note with data:', insertData);
      
      const { data, error } = await supabase
        .from('study_group_notes')
        .insert(insertData)
        .select();

      if (error) throw error;
      console.log("Note shared successfully:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-notes', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group-shared-notes', groupId] });
      queryClient.invalidateQueries({ queryKey: ['max-note-order', groupId] });
      setOpen(false);
      resetPointerEvents();
      toast({
        title: "Note shared",
        description: "The note has been shared with the group.",
      });
    },
    onError: (error) => {
      console.error('Error sharing note:', error);
      toast({
        variant: "destructive",
        title: "Error sharing note",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      resetPointerEvents();
    },
  });

  const unshareNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      if (!groupId) {
        throw new Error('Cannot unshare note: No group ID provided');
      }

      console.log("Unsharing note:", noteId, "from group:", groupId);
      const { error } = await supabase
        .from('study_group_notes')
        .delete()
        .eq('group_id', groupId)
        .eq('note_id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-notes', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group-shared-notes', groupId] });
      resetPointerEvents();
      toast({
        title: "Note unshared",
        description: "The note has been removed from the group.",
      });
    },
    onError: (error) => {
      console.error('Error unsharing note:', error);
      toast({
        variant: "destructive",
        title: "Error unsharing note",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      resetPointerEvents();
    },
  });

  const handleShareToggle = (noteId: string, isShared: boolean) => {
    if (isShared) {
      unshareNoteMutation.mutate(noteId);
    } else {
      shareNoteMutation.mutate(noteId);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetPointerEvents();
    }
  };

  // Instead of returning null, we'll disable the button if groupId is missing
  const isDisabled = !groupId;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Notes with Group</DialogTitle>
          <DialogDescription>
            Select individual notes to share with your study group members
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {(loadingNotes || loadingSharedNotes) ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {notes?.length ? (
                  notes.map((note) => {
                    const isShared = sharedNotes?.includes(note.id);
                    return (
                      <Card key={note.id}>
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{note.title}</CardTitle>
                              <CardDescription>
                                {note.content.substring(0, 100)}...
                              </CardDescription>
                            </div>
                            <Button
                              variant={isShared ? "destructive" : "secondary"}
                              size="sm"
                              onClick={() => handleShareToggle(note.id, !!isShared)}
                              disabled={shareNoteMutation.isPending || unshareNoteMutation.isPending}
                            >
                              {shareNoteMutation.isPending || unshareNoteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : isShared ? (
                                "Unshare"
                              ) : (
                                "Share"
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No notes found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
