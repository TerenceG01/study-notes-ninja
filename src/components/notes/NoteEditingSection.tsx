
import { useState, useEffect } from "react";
import { Note } from "@/hooks/useNotes";
import { EditNoteDialog } from "./EditNoteDialog";
import { useNoteEnhancement } from "@/hooks/useNoteEnhancement";
import { useNoteOperations } from "@/hooks/useNoteOperations";
import { NoteSummaryHandler } from "./NoteSummaryHandler";
import { CommonSubjects } from "./CommonSubjects";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useFullscreenState } from "@/hooks/useFullscreenState";

interface NoteEditingSectionProps {
  onNotesChanged: () => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  editingNote: Note | null;
  setEditingNote: (note: Note | null) => void;
}

export const NoteEditingSection = ({ 
  onNotesChanged, 
  selectedNote, 
  setSelectedNote, 
  editingNote, 
  setEditingNote 
}: NoteEditingSectionProps) => {
  // Use custom hooks for functionality
  const { enhancing, enhanceNote, cleanup } = useNoteEnhancement();
  const { updateNote } = useNoteOperations(onNotesChanged);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { isFullscreen, enableFullscreen } = useFullscreenState(true); // Default to fullscreen
  
  const [showSummary, setShowSummary] = useState(false);
  
  const summaryHandler = NoteSummaryHandler({
    selectedNote,
    editingNote,
    setEditingNote,
    setShowSummary
  });

  // Ensure fullscreen is enabled when a note is selected
  useEffect(() => {
    if (selectedNote) {
      enableFullscreen();
    }
  }, [selectedNote]);

  // Handle note enhancement
  const handleEnhanceNote = (enhanceType: 'grammar' | 'structure' | 'all') => {
    enhanceNote(editingNote, enhanceType, setEditingNote);
    
    if (isMobile) {
      toast({
        title: "Enhancing note...",
        description: "Your note is being enhanced. This may take a moment.",
      });
    }
  };

  // Handle save with toast notification for mobile
  const handleSave = () => {
    const success = updateNote(editingNote);
    
    if (success && isMobile) {
      toast({
        title: "Note saved",
        description: "Your changes have been saved successfully.",
      });
    }
    
    return success;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <EditNoteDialog
      open={!!selectedNote}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedNote(null);
          setEditingNote(null);
          setShowSummary(false);
        }
      }}
      selectedNote={selectedNote}
      editingNote={editingNote}
      showSummary={summaryHandler.showSummary}
      summaryLevel={summaryHandler.summaryLevel}
      summarizing={summaryHandler.summarizing}
      enhancing={enhancing}
      commonSubjects={CommonSubjects}
      onNoteChange={setEditingNote}
      onSummaryLevelChange={summaryHandler.setSummaryLevel}
      onGenerateSummary={summaryHandler.handleGenerateSummary}
      onToggleSummary={summaryHandler.toggleSummary}
      onEnhanceNote={handleEnhanceNote}
      onSave={handleSave}
      isFullscreen={isFullscreen}
    />
  );
};
