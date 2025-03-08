
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/hooks/useNotes";

export type SummaryLevel = 'brief' | 'medium' | 'detailed';

// Cache structure to store summaries locally
interface SummaryCache {
  [key: string]: {
    summary: string;
    timestamp: number;
  }
}

export const useNoteSummary = () => {
  const { toast } = useToast();
  const [summarizing, setSummarizing] = useState(false);
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>('medium');
  const [showSummary, setShowSummary] = useState(false);
  
  // In-memory cache for summaries
  const summaryCache = useRef<SummaryCache>({});
  
  // Clear old cache entries (older than 1 hour)
  useEffect(() => {
    const clearOldCache = () => {
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      Object.keys(summaryCache.current).forEach(key => {
        if (now - summaryCache.current[key].timestamp > oneHour) {
          delete summaryCache.current[key];
        }
      });
    };
    
    // Run once on mount and then every 10 minutes
    clearOldCache();
    const interval = setInterval(clearOldCache, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const generateSummary = useCallback(async (selectedNote: Note) => {
    try {
      // Create a cache key based on note content and summary level
      const cacheKey = `${summaryLevel}_${selectedNote.id}_${selectedNote.content.substring(0, 50)}`;
      
      // Check if we have a cached version
      if (summaryCache.current[cacheKey]) {
        console.log("Using cached summary");
        return summaryCache.current[cacheKey].summary;
      }
      
      setSummarizing(true);
      
      // Truncate very long content to speed up the API call
      const contentToSummarize = selectedNote.content.length > 10000 
        ? selectedNote.content.substring(0, 10000) + "..."
        : selectedNote.content;
      
      const { data, error } = await supabase.functions.invoke('summarize-note', {
        body: {
          content: contentToSummarize,
          level: summaryLevel,
        },
      });

      if (error) throw error;

      if (data?.summary) {
        // Cache the result
        summaryCache.current[cacheKey] = {
          summary: data.summary,
          timestamp: Date.now()
        };
        
        return data.summary;
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      return null;
    } finally {
      setSummarizing(false);
    }
  }, [summaryLevel]);

  return {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    setShowSummary,
    generateSummary,
  };
};
