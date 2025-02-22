
import { useMemo, useEffect } from "react";
import { useNotes } from "./useNotes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";

interface SubjectWithOrder {
  subject: string;
  order: number;
}

export function useSubjects() {
  const { notes, fetchNotes } = useNotes();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const uniqueSubjectsWithOrder = useMemo(() => {
    const subjectsMap = new Map<string, number>();
    
    notes.forEach(note => {
      if (note.subject && note.subject !== "General") {
        // If we haven't seen this subject yet, add it with its order
        if (!subjectsMap.has(note.subject)) {
          subjectsMap.set(note.subject, note.subject_order || 0);
        }
      }
    });

    return Array.from(subjectsMap.entries())
      .map(([subject, order]) => ({ subject, order }))
      .sort((a, b) => a.order - b.order);
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

  const reorderSubject = async (subjects: SubjectWithOrder[]) => {
    try {
      // Update all notes for each subject with new order
      for (const { subject, order } of subjects) {
        const { error } = await supabase
          .from('notes')
          .update({ subject_order: order })
          .eq('subject', subject);
        
        if (error) throw error;
      }

      await fetchNotes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error reordering subjects",
        description: "Failed to update subject order. Please try again.",
      });
    }
  };

  return {
    subjects: uniqueSubjectsWithOrder,
    handleRemoveSubject,
    reorderSubject
  };
}
