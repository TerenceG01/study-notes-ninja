
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NotesTable } from "@/components/notes/NotesTable";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NotesHeader } from "@/components/notes/NotesHeader";
import { NotesActionCards } from "@/components/notes/NotesActionCards";
import { useNotes, type Note } from "@/hooks/useNotes";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useNoteSummary } from "@/hooks/useNoteSummary";
import { CreateNoteContainer } from "@/components/notes/CreateNoteContainer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const commonSubjects = [
  "General",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Literature",
  "Computer Science",
  "Economics",
  "Psychology",
  "Philosophy",
  "Art",
  "Music",
  "Languages",
];

const Notes = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const { toast } = useToast();
  const isOpen = state === "expanded";
  const { notes, loading, generatingFlashcardsForNote, fetchNotes, createNote, generateFlashcards } = useNotes();
  const { 
    newNote, 
    newTag, 
    isEditorExpanded, 
    setNewTag, 
    setIsEditorExpanded, 
    handleNoteChange, 
    addTag, 
    removeTag, 
    resetEditor 
  } = useNoteEditor();
  const {
    summarizing,
    summaryLevel,
    showSummary,
    setSummaryLevel,
    setShowSummary,
    generateSummary,
  } = useNoteSummary();
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const handleCreateNote = async () => {
    if (!user) return;
    const success = await createNote(newNote, user.id);
    if (success) {
      resetEditor();
    }
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

      toast({
        title: "Success",
        description: "Note updated successfully!",
      });

      setSelectedNote(null);
      setEditingNote(null);
      setShowSummary(false);
      fetchNotes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Failed to update note. Please try again.",
      });
    }
  };

  if (!user) return null;

  return (
    <div className={cn(
      "px-4 py-6",
      "transition-all duration-300",
      isOpen ? "ml-20" : "ml-20",
      "max-w-[calc(100vw-5rem)]",
      "w-full"
    )}>
      <div className="mb-8 space-y-4 max-w-5xl mx-auto">
        <NotesHeader onSearch={(query) => console.log('Search:', query)} />
        <NotesActionCards onCreateNote={() => setIsEditorExpanded(true)} />
      </div>

      <CreateNoteContainer
        isExpanded={isEditorExpanded}
        note={newNote}
        newTag={newTag}
        commonSubjects={commonSubjects}
        onNoteChange={handleNoteChange}
        onTagChange={setNewTag}
        onAddTag={addTag}
        onRemoveTag={removeTag}
        onCancel={resetEditor}
        onSave={handleCreateNote}
      />

      <Card className="shadow-sm border-muted/20 max-w-5xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
          <CardTitle className="text-lg font-medium">Your Notes</CardTitle>
          <CardDescription>Browse and manage your existing notes</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <NotesTable
            notes={notes}
            loading={loading}
            generatingFlashcardsForNote={generatingFlashcardsForNote}
            onNoteClick={(note) => {
              setSelectedNote(note);
              setEditingNote(note);
              setShowSummary(false);
            }}
            onGenerateFlashcards={generateFlashcards}
          />
        </CardContent>
      </Card>

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
        showSummary={showSummary}
        summaryLevel={summaryLevel}
        summarizing={summarizing}
        newTag={newTag}
        commonSubjects={commonSubjects}
        onNoteChange={setEditingNote}
        onSummaryLevelChange={setSummaryLevel}
        onGenerateSummary={handleGenerateSummary}
        onToggleSummary={() => setShowSummary(!showSummary)}
        onNewTagChange={setNewTag}
        onSave={updateNote}
      />
    </div>
  );
};

export default Notes;
