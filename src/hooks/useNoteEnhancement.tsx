
import { useState, useRef, useCallback } from "react";
import { Note } from "@/hooks/useNotes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useNoteEnhancement = () => {
  const { toast } = useToast();
  const [enhancing, setEnhancing] = useState(false);
  const enhanceRequestRef = useRef<AbortController | null>(null);
  const enhancementCache = useRef<Map<string, string>>(new Map());

  const enhanceNote = useCallback(async (
    editingNote: Note | null, 
    enhanceType: 'grammar' | 'structure' | 'all',
    setEditingNote: (note: Note | null) => void
  ) => {
    if (!editingNote) return;
    
    try {
      // Cancel any pending request
      if (enhanceRequestRef.current) {
        enhanceRequestRef.current.abort();
      }
      
      // Create new abort controller
      enhanceRequestRef.current = new AbortController();
      
      setEnhancing(true);
      
      // Check cache first
      const cacheKey = `${enhanceType}_${editingNote.id}_${editingNote.content.substring(0, 100)}`;
      if (enhancementCache.current.has(cacheKey)) {
        console.log("Using cached enhancement");
        setEditingNote({
          ...editingNote,
          content: enhancementCache.current.get(cacheKey) || editingNote.content
        });
        
        toast({
          title: "Note enhanced!",
          description: `Your note has been successfully improved.`,
        });
        
        setEnhancing(false);
        return;
      }
      
      // Show friendly loading toast with type-specific message
      const enhanceTypeText = enhanceType === 'grammar' ? 'grammar and spelling' : 
                             enhanceType === 'structure' ? 'structure and formatting' : 'content';
      
      const loadingToastId = toast({
        title: `Enhancing ${enhanceTypeText}...`,
        description: "Our AI assistant is polishing your note. This may take a few moments.",
      }).id;

      // Send the rich text content as is to preserve HTML formatting
      const contentToEnhance = editingNote.content;

      const { data, error } = await supabase.functions.invoke('enhance-note', {
        body: {
          content: contentToEnhance,
          title: editingNote.title,
          enhanceType
        },
      });

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      if (error) throw error;

      if (data.enhancedContent) {
        // Cache the enhanced content
        enhancementCache.current.set(cacheKey, data.enhancedContent);
        
        // Update the note with enhanced content, which should be properly formatted HTML
        setEditingNote({
          ...editingNote,
          content: data.enhancedContent
        });
        
        toast({
          title: "Note enhanced!",
          description: `Your note's ${enhanceTypeText} has been successfully improved.`,
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error enhancing note:", error);
        toast({
          variant: "destructive",
          title: "Enhancement failed",
          description: "Failed to enhance your note. Please try again later.",
        });
      }
    } finally {
      setEnhancing(false);
      enhanceRequestRef.current = null;
    }
  }, [toast]);

  // Cleanup function
  const cleanup = () => {
    if (enhanceRequestRef.current) {
      enhanceRequestRef.current.abort();
    }
  };

  return {
    enhancing,
    enhanceNote,
    cleanup
  };
};
