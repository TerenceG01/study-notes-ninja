
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { ViewSharedNote } from "./ViewSharedNote";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

interface SharedNote {
  id: string;
  note: {
    id: string;
    title: string;
    content: string;
    created_at: string;
  };
  shared_by: string;
  shared_at: string;
  display_order: number;
  shared_by_profile: {
    username: string | null;
    full_name: string | null;
  } | null;
}

interface SharedNotesProps {
  groupId: string;
}

const DraggableNoteCard = ({ note }: { note: SharedNote }) => {
  const [selectedNote, setSelectedNote] = useState<SharedNote['note'] | null>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: note.id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
  } : undefined;

  const sharedByName = note.shared_by_profile?.username || 
                      note.shared_by_profile?.full_name || 
                      'Unknown';
  const initials = sharedByName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className="cursor-pointer transition-colors hover:shadow-lg border hover:border-accent relative group"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move p-2"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div onClick={() => setSelectedNote(note.note)}>
        <CardHeader className="space-y-0 pb-2 pl-10">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-1">{note.note.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {note.note.content}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{sharedByName}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(note.shared_at), 'MMM d')}
            </span>
          </div>
        </CardContent>
      </div>
      
      {selectedNote && (
        <ViewSharedNote
          note={selectedNote}
          open={!!selectedNote}
          onOpenChange={(open) => !open && setSelectedNote(null)}
        />
      )}
    </Card>
  );
};

export const SharedNotes = ({ groupId }: SharedNotesProps) => {
  const queryClient = useQueryClient();
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

  console.log('SharedNotes component rendered with groupId:', groupId);

  const { data: notes, isLoading } = useQuery({
    queryKey: ['group-shared-notes', groupId],
    queryFn: async () => {
      console.log('Fetching shared notes for group:', groupId);
      
      if (!groupId) {
        console.error('No group ID provided');
        return [];
      }

      const { data, error } = await supabase
        .from('study_group_notes')
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
        .eq('group_id', groupId)
        .order('display_order');

      if (error) {
        console.error('Error fetching shared notes:', error);
        throw error;
      }

      console.log('Fetched shared notes:', data);
      return (data || []) as SharedNote[];
    },
    enabled: !!groupId,
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('study_group_notes')
        .update({ display_order: newOrder })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-shared-notes', groupId] });
    },
  });

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
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No notes have been shared yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={notes.map(note => note.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {notes.map((note) => (
              <DraggableNoteCard key={note.id} note={note} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </ScrollArea>
  );
};
