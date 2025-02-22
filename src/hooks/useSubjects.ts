
import { useMemo, useEffect } from "react";
import { useNotes } from "./useNotes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";

export function useSubjects() {
  const { notes, fetchNotes } = useNotes();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(notes.map(note => note.subject)))
      .filter(subject => subject && subject !== "General")
      .sort();
  }, [notes]);

  useEffect(() => {
    const channel = supabase
      .channel('subjects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes'
        },
        (payload) => {
          console.log("Subjects realtime update received:", payload);
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotes]);

  const handleRemoveSubject = async (subject: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ subject: null })
        .eq('subject', subject);

      if (error) throw error;

      // Clear the subject from URL params if it's the current subject
      const currentSubject = searchParams.get("subject");
      if (currentSubject === subject) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("subject");
        setSearchParams(newSearchParams);
      }

      // Refresh the notes list
      await fetchNotes();
      
      toast({
        title: "Success",
        description: `Removed subject: ${subject}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error removing subject",
        description: "Failed to remove subject. Please try again.",
      });
    }
  };

  return {
    uniqueSubjects,
    handleRemoveSubject
  };
}
