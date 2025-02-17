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
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[150px] w-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} refetch={refetch} />
          ))}
        </div>
      ) : (
        <EmptyNotesState />
      )}
    </div>
  );
};
