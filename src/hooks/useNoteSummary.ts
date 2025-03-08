
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/hooks/useNotes";

export type SummaryLevel = 'brief' | 'medium' | 'detailed';

export const useNoteSummary = () => {
  const { toast } = useToast();
  const [summarizing, setSummarizing] = useState(false);
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>('medium');
  const [showSummary, setShowSummary] = useState(false);

  const generateSummary = async (selectedNote: Note) => {
    try {
      setSummarizing(true);
      const { data, error } = await supabase.functions.invoke('summarize-note', {
        body: {
          content: selectedNote.content,
          level: summaryLevel,
        },
      });

      if (error) throw error;

      if (data?.summary) {
        return data.summary;
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      return null;
    } finally {
      setSummarizing(false);
    }
  };

  return {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    setShowSummary,
    generateSummary,
  };
};
