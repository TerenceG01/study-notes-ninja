
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NoteCard } from "@/components/notes/NoteCard";
import { Note } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { EmptyNotesState } from "@/components/notes/EmptyNotesState";
import { Skeleton } from "@/components/ui/skeleton";

export const NotesContent = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { user } = useAuth();

  const { data: notesData, isLoading, isError, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (notesData) {
      setNotes(notesData);
    }
  }, [notesData]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-none w-[300px]">
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <p>Error loading notes.</p>;
  }

  return (
    <div className="mx-auto max-w-[min(100%,72rem)]">
      {notes.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {notes.map((note) => (
            <div key={note.id} className="flex-none w-[300px] snap-start">
              <NoteCard note={note} refetch={refetch} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyNotesState />
      )}
    </div>
  );
};
