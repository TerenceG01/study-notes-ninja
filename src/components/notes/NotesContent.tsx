
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NotesTable } from "./NotesTable";
import { EditNoteDialog } from "./EditNoteDialog";
import { useNotes, type Note } from "@/hooks/useNotes";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useNoteSummary } from "@/hooks/useNoteSummary";
import { CreateNoteContainer } from "./CreateNoteContainer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CommonSubjects } from "./CommonSubjects";
import { useSearchParams } from "react-router-dom";

export const NotesContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const currentSubject = searchParams.get("subject");
  
  const { notes: allNotes, loading, generatingFlashcardsForNote, fetchNotes, createNote, generateFlashcards } = useNotes();
  const { 
    newNote, 
    newTag, 
    isEditorExpanded,
    setIsEditorExpanded, 
    setNewTag, 
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

  // Filter notes based on selected subject
  const filteredNotes = currentSubject
    ? allNotes.filter(note => note.subject === currentSubject)
    : allNotes;

  const handleCreateNote = async () => {
    if (!user) return;
    const success = await createNote(newNote, user.id);
    if (success) {
      resetEditor();
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
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

  return (
    <div className="mx-auto max-w-[min(100%,64rem)]">
      <CreateNoteContainer
        isExpanded={isEditorExpanded}
        note={newNote}
        newTag={newTag}
        commonSubjects={CommonSubjects}
        onNoteChange={handleNoteChange}
        onTagChange={setNewTag}
        onAddTag={addTag}
        onRemoveTag={removeTag}
        onCancel={resetEditor}
        onSave={handleCreateNote}
      />

      <Card className="shadow-sm border-muted/20">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
          <CardTitle className="text-lg font-medium">Your Notes</CardTitle>
          <CardDescription>Browse and manage your existing notes</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <NotesTable
            notes={filteredNotes}
            loading={loading}
            generatingFlashcardsForNote={generatingFlashcardsForNote}
            onNoteClick={(note) => {
              setSelectedNote(note);
              setEditingNote(note);
              setShowSummary(false);
            }}
            onGenerateFlashcards={generateFlashcards}
            onNotesChanged={fetchNotes}
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
        commonSubjects={CommonSubjects}
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
