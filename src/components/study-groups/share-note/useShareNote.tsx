
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Note } from "@/components/notes/types";

export const useShareNote = (groupId: string) => {
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

  // Fetch user notes
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

  // Fetch shared notes
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

  // Get max order
  const { data: maxOrder } = useQuery({
    queryKey: ['max-note-order', groupId],
    queryFn: async () => {
      if (!groupId) return 0;
      const { data, error } = await supabase
        .from('study_group_notes')
        .select('display_order')
        .eq('group_id', groupId)
        .order('display_order', { ascending: false })
        .limit(1);

      if (error) throw error;
      const maxOrder = data.length > 0 ? data[0].display_order : 0;
      return maxOrder;
    },
    enabled: !!groupId && !!user,
  });

  // Share note mutation
  const shareNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      if (!groupId || !user?.id) {
        throw new Error('Cannot share note: Missing required data');
      }

      const nextOrder = (maxOrder || 0) + 1;
      
      const insertData = {
        group_id: groupId,
        note_id: noteId,
        shared_by: user.id,
        display_order: nextOrder,
      };
      
      const { data, error } = await supabase
        .from('study_group_notes')
        .insert(insertData)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateQueries();
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

  // Share multiple notes mutation
  const shareMultipleNotesMutation = useMutation({
    mutationFn: async (noteIds: string[]) => {
      if (!groupId || !user?.id || noteIds.length === 0) {
        throw new Error('Cannot share notes: Missing required data');
      }

      const currentMaxOrder = (maxOrder || 0);
      
      const insertData = noteIds.map((noteId, index) => ({
        group_id: groupId,
        note_id: noteId,
        shared_by: user.id,
        display_order: currentMaxOrder + index + 1,
      }));
      
      const { data, error } = await supabase
        .from('study_group_notes')
        .insert(insertData)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      invalidateQueries();
      setOpen(false);
      resetPointerEvents();
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
      resetPointerEvents();
    },
  });

  // Unshare note mutation
  const unshareNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      if (!groupId) {
        throw new Error('Cannot unshare note: No group ID provided');
      }

      const { error } = await supabase
        .from('study_group_notes')
        .delete()
        .eq('group_id', groupId)
        .eq('note_id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQueries();
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

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['shared-notes', groupId] });
    queryClient.invalidateQueries({ queryKey: ['group-shared-notes', groupId] });
    queryClient.invalidateQueries({ queryKey: ['max-note-order', groupId] });
  };

  const handleShareToggle = (noteId: string, isShared: boolean) => {
    if (isShared) {
      unshareNoteMutation.mutate(noteId);
    } else {
      shareNoteMutation.mutate(noteId);
    }
  };

  const handleShareMultiple = (noteIds: string[]) => {
    // Filter out already shared notes
    const unsharedNoteIds = noteIds.filter(id => !sharedNotes?.includes(id));
    if (unsharedNoteIds.length === 0) {
      toast({
        title: "No new notes to share",
        description: "All selected notes are already shared with the group."
      });
      return;
    }
    shareMultipleNotesMutation.mutate(unsharedNoteIds);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetPointerEvents();
    }
  };

  return {
    notes,
    sharedNotes,
    open,
    loadingNotes,
    loadingSharedNotes,
    isPending: shareNoteMutation.isPending || unshareNoteMutation.isPending || shareMultipleNotesMutation.isPending,
    handleShareToggle,
    handleShareMultiple,
    handleOpenChange,
    setOpen,
    isDisabled: !groupId
  };
};
