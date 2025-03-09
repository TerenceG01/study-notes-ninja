
import { useState, useEffect } from "react";
import { Note } from "@/hooks/useNotes";
import { EditNoteDialog } from "./EditNoteDialog";
import { useNoteEnhancement } from "@/hooks/useNoteEnhancement";
import { useNoteOperations } from "@/hooks/useNoteOperations";
import { NoteSummaryHandler } from "./NoteSummaryHandler";
import { CommonSubjects } from "./CommonSubjects";

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
  
  const [showSummary, setShowSummary] = useState(false);
  
  const summaryHandler = NoteSummaryHandler({
    selectedNote,
    editingNote,
    setEditingNote,
    setShowSummary
  });

  // Handle note enhancement
  const handleEnhanceNote = (enhanceType: 'grammar' | 'structure' | 'all') => {
    enhanceNote(editingNote, enhanceType, setEditingNote);
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
      onSave={() => updateNote(editingNote)}
    />
  );
};
