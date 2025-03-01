
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useAuth } from "@/contexts/AuthContext";
import { ViewSharedNote } from "./ViewSharedNote";
import { DraggableNoteCard } from "./DraggableNoteCard";
import { RemoveNoteDialog } from "./RemoveNoteDialog";
import { ErrorBoundary } from "./ErrorBoundary";
import { EmptyNotes } from "./EmptyNotes";
import { LoadingNotes } from "./LoadingNotes";
import { SharedNote, SharedNotesProps } from "./types";

export const SharedNotes = ({ groupId }: SharedNotesProps) => {
  console.log("SharedNotes component rendering with groupId:", groupId);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [confirmRemoval, setConfirmRemoval] = useState<{
    open: boolean;
    note: SharedNote | null;
  }>({
    open: false,
    note: null,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  // Fix for note dialog state management
  const [selectedNoteState, setSelectedNoteState] = useState<{
    open: boolean;
    note: SharedNote["note"] | null;
  }>({
    open: false,
    note: null,
  });

  // Remove excessive console logs and add error boundary
  const { data: notes, isLoading, error, refetch } = useQuery({
    queryKey: ["group-shared-notes", groupId],
    queryFn: async () => {
      if (!groupId) {
        console.log("No groupId provided");
        return [];
      }

      try {
        console.log("Fetching notes for group:", groupId);

        // First, let's verify the group exists
        const { data: groupCheck, error: groupError } = await supabase
          .from("study_groups")
          .select("id")
          .eq("id", groupId)
          .single();

        if (groupError || !groupCheck) {
          console.error("Group not found:", groupError);
          throw new Error("Group not found");
        }

        console.log("Group exists, fetching shared notes");

        // Now fetch the shared notes with their related data
        const { data, error } = await supabase
          .from("study_group_notes")
          .select(`
            id,
            note_id,
            note:notes (
              id,
              title,
              content,
              created_at
            ),
            shared_by,
            shared_at,
            display_order,
            shared_by_profile:profiles (
              username,
              full_name
            )
          `)
          .eq("group_id", groupId)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching shared notes:", error);
          throw error;
        }

        console.log("Shared notes fetched:", data);

        // Filter out any notes with missing data
        const validNotes = data?.filter((note) => note.note && note.note.id) || [];
        console.log("Valid notes:", validNotes.length);
        return validNotes as SharedNote[];
      } catch (error) {
        console.error("Failed to load shared notes:", error);
        // Use toast for visible error
        toast({
          variant: "destructive",
          title: "Failed to load shared notes",
          description:
            error instanceof Error ? error.message : "An unknown error occurred",
        });
        throw error;
      }
    },
    enabled: !!groupId,
    // Add retry logic
    retry: 2,
    refetchOnWindowFocus: true,
    staleTime: 10000, // 10 seconds
    meta: {
      errorToast: true,
    },
  });

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      console.error("Error in useEffect:", error);
      toast({
        variant: "destructive",
        title: "Error loading shared notes",
        description: "Please try refreshing the page",
      });
    }
  }, [error, toast]);

  // Add a refetch effect when groupId changes
  useEffect(() => {
    if (groupId) {
      console.log("GroupId changed, refetching notes");
      refetch();
    }
  }, [groupId, refetch]);

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from("study_group_notes")
        .update({ display_order: newOrder })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-shared-notes", groupId] });
    },
    onError: (error) => {
      console.error("Error updating note order:", error);
      toast({
        variant: "destructive",
        title: "Error updating note order",
        description: "Failed to update the order of notes",
      });
    },
  });

  const removeNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      console.log("Removing note with ID:", noteId);
      const { error } = await supabase
        .from("study_group_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-shared-notes", groupId] });
      queryClient.invalidateQueries({ queryKey: ["shared-notes", groupId] });
      toast({
        title: "Note removed",
        description: "The note has been removed from the study group",
      });
      setConfirmRemoval({ open: false, note: null });
    },
    onError: (error) => {
      console.error("Error removing note:", error);
      toast({
        variant: "destructive",
        title: "Error removing note",
        description: "Failed to remove the note from the study group",
      });
    },
  });

  const handleNoteClick = (note: SharedNote) => {
    console.log("Note clicked:", note);
    setSelectedNoteState({
      open: true,
      note: note.note,
    });
  };

  const handleRemoveNote = (note: SharedNote) => {
    setConfirmRemoval({ open: true, note });
  };

  const confirmRemoveNote = () => {
    if (confirmRemoval.note) {
      removeNoteMutation.mutate(confirmRemoval.note.id);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Only change the open state, preserve the note data until animation completes
      setSelectedNoteState((prev) => ({
        ...prev,
        open,
      }));

      // Clear note data after dialog closing animation completes
      setTimeout(() => {
        if (!open) {
          setSelectedNoteState((prev) => ({
            ...prev,
            note: null,
          }));
        }
      }, 300);
    } else {
      setSelectedNoteState((prev) => ({
        ...prev,
        open,
      }));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !notes) return;

    const oldIndex = notes.findIndex((note) => note.id === active.id);
    const newIndex = notes.findIndex((note) => note.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedNotes = [...notes];
    const movedNote = updatedNotes[oldIndex];
    updatedNotes.splice(oldIndex, 1);
    updatedNotes.splice(newIndex, 0, movedNote);

    updatedNotes.forEach((note, index) => {
      if (note.display_order !== index + 1) {
        updateOrderMutation.mutate({
          id: note.id,
          newOrder: index + 1,
        });
      }
    });
  };

  if (isLoading) {
    return <LoadingNotes />;
  }

  if (!notes || notes.length === 0) {
    return <EmptyNotes />;
  }

  return (
    <ScrollArea className="h-[400px]">
      <ErrorBoundary
        fallback={
          <div className="text-center py-8 text-destructive">
            Error loading notes. Please try refreshing the page.
          </div>
        }
      >
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext
            items={notes.map((note) => note.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {notes.map((note) => (
                <DraggableNoteCard
                  key={note.id}
                  note={note}
                  onNoteClick={handleNoteClick}
                  onRemoveNote={handleRemoveNote}
                  isCurrentUserNote={note.shared_by === user?.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Confirm remove note dialog */}
        <RemoveNoteDialog
          open={confirmRemoval.open}
          onOpenChange={(open) =>
            setConfirmRemoval((prev) => ({ ...prev, open }))
          }
          onConfirm={confirmRemoveNote}
          isPending={removeNoteMutation.isPending}
          note={confirmRemoval.note}
        />

        {/* Use the improved state management for the dialog */}
        {selectedNoteState.note && (
          <ViewSharedNote
            note={selectedNoteState.note}
            open={selectedNoteState.open}
            onOpenChange={handleDialogOpenChange}
          />
        )}
      </ErrorBoundary>
    </ScrollArea>
  );
};
