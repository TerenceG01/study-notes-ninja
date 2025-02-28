
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";
import { useState, useEffect } from "react";
import { useNotes, Note } from "@/hooks/useNotes";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";
import { useNoteSummary } from "@/hooks/useNoteSummary";
import { CommonSubjects } from "@/components/notes/CommonSubjects";
import { supabase } from "@/integrations/supabase/client";

const Notes = () => {
  const { user } = useAuth();
  const { 
    notes, 
    loading, 
    generatingFlashcardsForNote,
    fetchNotes, 
    generateFlashcards 
  } = useNotes();
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { newTag, setNewTag } = useNoteEditor();
  const {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    setShowSummary,
    generateSummary,
  } = useNoteSummary();

  useEffect(() => {
    if (user) {
      console.log("Notes page: fetching notes for user", user.id);
      fetchNotes();
    }
  }, [user, fetchNotes]);

  useEffect(() => {
    if (selectedNote) {
      setEditingNote({...selectedNote});
    }
  }, [selectedNote]);

  const handleNoteClick = (note: Note) => {
    console.log("Note clicked:", note);
    setSelectedNote(note);
    setEditingNote(note);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedNote(null);
    setEditingNote(null);
    setShowSummary(false);
  };

  const handleGenerateSummary = async () => {
    if (!selectedNote || !editingNote) return;
    const summary = await generateSummary(selectedNote);
    if (summary) {
      setEditingNote(prev => prev ? { ...prev, summary } : null);
      setShowSummary(true);
    }
  };

  const updateNote = async () => {
    if (!editingNote) return;
    
    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: editingNote.title,
          content: editingNote.content,
          summary: editingNote.summary,
          tags: editingNote.tags || [],
          subject: editingNote.subject,
        })
        .eq("id", editingNote.id);

      if (error) throw error;

      fetchNotes();
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  if (!user) return null;
  
  return (
    <div className="min-h-screen pt-6">
      <div className="container mx-auto max-w-[1400px] px-4 lg:px-8">
        <NotesContent 
          notes={notes}
          loading={loading}
          generatingFlashcardsForNote={generatingFlashcardsForNote}
          fetchNotes={fetchNotes}
          generateFlashcards={generateFlashcards}
          onNoteClick={handleNoteClick}
          newTag={newTag}
          setNewTag={setNewTag}
        />
        
        {selectedNote && (
          <EditNoteDialog
            open={isEditDialogOpen}
            onOpenChange={handleCloseEditDialog}
            selectedNote={selectedNote}
            editingNote={editingNote}
            showSummary={showSummary}
            summaryLevel={summaryLevel}
            summarizing={summarizing}
            newTag={newTag}
            commonSubjects={CommonSubjects}
            onNoteChange={setEditingNote}
            onSummaryLevelChange={setSummaryLevel}
            onGenerateSummary={handleGenerateSummary}
            onToggleSummary={() => setShowSummary(!showSummary)}
            onNewTagChange={setNewTag}
            onSave={updateNote}
          />
        )}
      </div>
    </div>
  );
};

export default Notes;
