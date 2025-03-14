
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Note } from "@/components/notes/types";

export const useMultiShareNote = (groupId: string) => {
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
      return data as Note[];
    },
    enabled: !!user,
  });

  // Fetch shared notes
  const { data: sharedNotes, isLoading: loadingSharedNotes } = useQuery({
    queryKey: ['shared-notes', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const { data, error } = await supabase
        .from('study_group_notes')
        .select('note_id')
        .eq('group_id', groupId);

      if (error) throw error;
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

  // Mutation for sharing multiple notes at once
  const shareMultipleNotesMutation = useMutation({
    mutationFn: async (noteIds: string[]) => {
      if (!groupId || !user?.id || noteIds.length === 0) {
        throw new Error('Cannot share notes: Missing required data');
      }

      let nextOrder = (maxOrder || 0) + 1;
      
      // Filter out already shared notes
      const { data: existingShared, error: checkError } = await supabase
        .from('study_group_notes')
        .select('note_id')
        .eq('group_id', groupId)
        .in('note_id', noteIds);
      
      if (checkError) throw checkError;
      
      const alreadySharedIds = existingShared.map(item => item.note_id);
      const newNotesToShare = noteIds.filter(id => !alreadySharedIds.includes(id));
      
      if (newNotesToShare.length === 0) {
        return { shared: 0 };
      }
      
      // Create records to insert
      const notesToInsert = newNotesToShare.map(noteId => ({
        group_id: groupId,
        note_id: noteId,
        shared_by: user.id,
        display_order: nextOrder++
      }));
      
      const { data, error } = await supabase
        .from('study_group_notes')
        .insert(notesToInsert)
        .select();

      if (error) throw error;
      
      return { shared: notesToInsert.length };
    },
    onSuccess: (result) => {
      invalidateQueries();
      setOpen(false);
      resetPointerEvents();
      
      if (result.shared > 0) {
        toast({
          title: "Notes shared",
          description: `Successfully shared ${result.shared} note${result.shared !== 1 ? 's' : ''} with the group.`,
        });
      } else {
        toast({
          title: "No new notes shared",
          description: "All selected notes were already shared with this group.",
        });
      }
    },
    onError: (error) => {
      console.error('Error sharing notes:', error);
      toast({
        variant: "destructive",
        title: "Error sharing notes",
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
    isPending: shareMultipleNotesMutation.isPending,
    handleOpenChange,
    setOpen,
    isDisabled: !groupId,
    shareMultipleNotes: shareMultipleNotesMutation.mutate
  };
};
