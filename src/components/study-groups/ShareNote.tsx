
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
import { FileText, Loader2, Share2, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  subject?: string;
}

interface ShareNoteProps {
  groupId: string;
  selectedNoteId?: string;
  selectedSubject?: string;
}

export const ShareNote = ({ groupId, selectedNoteId, selectedSubject }: ShareNoteProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [shareMode, setShareMode] = useState<"single" | "subject">(selectedNoteId ? "single" : "subject");

  console.log('ShareNote rendered with groupId:', groupId); // Debug log
  console.log('Selected note ID:', selectedNoteId);
  console.log('Selected subject:', selectedSubject);

  const { data: notes, isLoading: loadingNotes } = useQuery({
    queryKey: ['user-notes', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('id, title, content, created_at, subject')
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

  // Filtered notes based on selected subject (when in subject mode)
  const filteredNotes = notes?.filter(note => {
    if (shareMode === "single" && selectedNoteId) {
      return note.id === selectedNoteId;
    } else if (shareMode === "subject" && selectedSubject) {
      return note.subject === selectedSubject;
    }
    return true; // Show all notes if no filtering criteria
  });

  // Effect to focus on the specific note or subject when dialog opens
  useEffect(() => {
    if (open) {
      if (selectedNoteId) {
        setShareMode("single");
      } else if (selectedSubject) {
        setShareMode("subject");
      }
    }
  }, [open, selectedNoteId, selectedSubject]);

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
    },
  });

  const shareMultipleNotesMutation = useMutation({
    mutationFn: async (noteIds: string[]) => {
      if (!groupId || !user?.id || !noteIds.length) {
        throw new Error('Cannot share notes: Missing required data');
      }

      // Create array of objects to insert
      const insertData = noteIds.map((noteId, index) => ({
        group_id: groupId,
        note_id: noteId,
        shared_by: user.id,
        display_order: (maxOrder || 0) + index + 1,
      }));
      
      console.log('Sharing multiple notes:', insertData);
      
      const { data, error } = await supabase
        .from('study_group_notes')
        .insert(insertData)
        .select();

      if (error) throw error;
      console.log("Notes shared successfully:", data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shared-notes', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group-shared-notes', groupId] });
      queryClient.invalidateQueries({ queryKey: ['max-note-order', groupId] });
      setOpen(false);
      toast({
        title: "Notes shared",
        description: `${variables.length} notes have been shared with the group.`,
      });
    },
    onError: (error) => {
      console.error('Error sharing multiple notes:', error);
      toast({
        variant: "destructive",
        title: "Error sharing notes",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
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
    },
  });

  const handleShareToggle = (noteId: string, isShared: boolean) => {
    if (isShared) {
      unshareNoteMutation.mutate(noteId);
    } else {
      shareNoteMutation.mutate(noteId);
    }
  };

  const handleShareAll = () => {
    if (!filteredNotes?.length) return;
    
    // Filter out notes that are already shared
    const notesToShare = filteredNotes
      .filter(note => !sharedNotes?.includes(note.id))
      .map(note => note.id);
    
    if (notesToShare.length === 0) {
      toast({
        description: "All selected notes are already shared with this group.",
      });
      return;
    }
    
    shareMultipleNotesMutation.mutate(notesToShare);
  };

  // Instead of returning null, we'll disable the button if groupId is missing
  const isDisabled = !groupId;
  
  // Calculate how many notes will be shared in subject mode
  const subjectNotesCount = shareMode === "subject" && selectedSubject
    ? notes?.filter(note => note.subject === selectedSubject && !sharedNotes?.includes(note.id)).length
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Select notes to share with your study group members
          </DialogDescription>
        </DialogHeader>
        
        {/* Share Mode Selector */}
        {selectedNoteId || selectedSubject ? (
          <div className="mb-4">
            <RadioGroup 
              value={shareMode} 
              onValueChange={(value) => setShareMode(value as "single" | "subject")}
              className="flex flex-col space-y-2"
            >
              {selectedNoteId && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="share-single" />
                  <Label htmlFor="share-single">Share selected note only</Label>
                </div>
              )}
              {selectedSubject && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="subject" id="share-subject" />
                  <Label htmlFor="share-subject" className="flex items-center">
                    Share all notes with subject &quot;{selectedSubject}&quot;
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          {subjectNotesCount} notes will be shared
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>
              )}
            </RadioGroup>
            
            {/* Share All Button for Subject Mode */}
            {shareMode === "subject" && selectedSubject && (
              <Button 
                className="mt-4" 
                onClick={handleShareAll}
                disabled={shareMultipleNotesMutation.isPending || subjectNotesCount === 0}
              >
                {shareMultipleNotesMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4 mr-2" />
                )}
                Share All {subjectNotesCount > 0 ? `(${subjectNotesCount})` : "(None Available)"}
              </Button>
            )}
          </div>
        )}
        
        <div className="py-4">
          {(loadingNotes || loadingSharedNotes) ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {filteredNotes?.length ? (
                  filteredNotes.map((note) => {
                    const isShared = sharedNotes?.includes(note.id);
                    return (
                      <Card key={note.id}>
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{note.title}</CardTitle>
                              <CardDescription>
                                {note.content.substring(0, 100)}...
                                {note.subject && (
                                  <div className="mt-1">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                      {note.subject}
                                    </span>
                                  </div>
                                )}
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
