
import { useState, useMemo, useEffect } from "react";
import { useNotes } from "./useNotes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";

export function useSubjects() {
  const { notes, fetchNotes } = useNotes();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [draggedSubject, setDraggedSubject] = useState<string | null>(null);
  const [dragOverSubject, setDragOverSubject] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(notes.map(note => note.subject || "General")))
      .filter(Boolean)
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

  const handleMoveSubject = async (fromSubject: string, toSubject: string) => {
    if (!fromSubject || !toSubject || fromSubject === toSubject) return;
    
    try {
      const notesWithFromSubject = notes.filter(n => n.subject === fromSubject);
      const notesWithToSubject = notes.filter(n => n.subject === toSubject);
      
      for (const note of notesWithFromSubject) {
        const { error } = await supabase
          .from('notes')
          .update({ subject: toSubject })
          .eq('id', note.id);
        if (error) throw error;
      }
      
      for (const note of notesWithToSubject) {
        const { error } = await supabase
          .from('notes')
          .update({ subject: fromSubject })
          .eq('id', note.id);
        if (error) throw error;
      }

      await fetchNotes();
      
      toast({
        title: "Success",
        description: `Swapped ${fromSubject} with ${toSubject}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error moving subject",
        description: "Failed to move subject. Please try again.",
      });
    }
  };

  return {
    uniqueSubjects,
    draggedSubject,
    setDraggedSubject,
    dragOverSubject,
    setDragOverSubject,
    isDragging,
    setIsDragging,
    handleMoveSubject,
    handleRemoveSubject
  };
}
