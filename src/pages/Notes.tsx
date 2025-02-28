
import { useAuth } from "@/contexts/AuthContext";
import { NotesContent } from "@/components/notes/NotesContent";
import { useState, useEffect } from "react";
import { useNotes, Note } from "@/hooks/useNotes";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { newTag, setNewTag } = useNoteEditor();

  useEffect(() => {
    if (user) {
      console.log("Notes page: fetching notes for user", user.id);
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const handleNoteClick = (note: Note) => {
    console.log("Note clicked:", note);
    setSelectedNote(note);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedNote(null);
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
            note={selectedNote}
            open={isEditDialogOpen}
            onOpenChange={handleCloseEditDialog}
            onSave={() => {
              fetchNotes();
              handleCloseEditDialog();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Notes;
