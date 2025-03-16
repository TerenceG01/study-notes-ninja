
import { useToast } from "@/hooks/use-toast";
import { useNoteEnhancement } from "@/hooks/useNoteEnhancement";

export const useNoteEditorEnhancement = (newNote: {
  title: string;
  content: string;
  subject: string;
  summary?: string;
}, handleNoteChange: (field: string, value: string | string[]) => void) => {
  const { toast } = useToast();
  const { enhancing, enhanceNote } = useNoteEnhancement();
  
  const handleEnhanceNote = async (enhanceType: 'grammar' | 'structure' | 'all') => {
    try {
      // Show loading toast
      const loadingToastId = toast({
        title: "Enhancing note...",
        description: "Our AI is improving your note.",
      }).id;
      
      // Create a properly formatted Note object
      const fullNote = {
        id: 'new-note-temp-id',
        title: newNote.title,
        content: newNote.content,
        subject: newNote.subject || 'General',
        created_at: new Date().toISOString(),
        folder: 'My Notes'
      };
      
      await enhanceNote(fullNote, enhanceType, (enhancedNote) => {
        if (enhancedNote) {
          handleNoteChange('content', enhancedNote.content);
          
          // Dismiss loading toast
          toast.dismiss(loadingToastId);
          
          toast({
            title: "Note enhanced",
            description: "Your note has been improved successfully.",
          });
        }
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Enhancement failed",
        description: "There was an error enhancing your note.",
      });
    }
  };

  return {
    enhancing,
    handleEnhanceNote,
  };
};
