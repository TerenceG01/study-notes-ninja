import { useState, useEffect } from "react";
import { useNotes, type Note } from "@/hooks/useNotes";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useNoteSummary } from "@/hooks/useNoteSummary";
import { CreateNoteContainer } from "./CreateNoteContainer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CommonSubjects } from "./CommonSubjects";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { NotesContainer } from "./NotesContainer";
import { EditNoteDialog } from "./EditNoteDialog";
import { NotesHeader } from "./NotesHeader";

export const NotesContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSubject = searchParams.get("subject");

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    notes: allNotes,
    loading,
    generatingFlashcardsForNote,
    fetchNotes,
    createNote,
    generateFlashcards
  } = useNotes();

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
    generateSummary
  } = useNoteSummary();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const uniqueSubjects = Array.from(new Set(allNotes.map(note => note.subject).filter(Boolean)));

  const filteredNotes = allNotes.filter(note => {
    const matchesColor = !selectedColor || note.subject_color === selectedColor;
    const matchesSubject = !currentSubject || note.subject === currentSubject;
    const matchesDate = !selectedDate || format(new Date(note.created_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    const matchesSearch = !searchQuery || note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.content.toLowerCase().includes(searchQuery.toLowerCase()) || (note.subject?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesColor && matchesSubject && matchesDate && matchesSearch;
  });

  const handleCreateNote = async () => {
    if (!user) return;
    const success = await createNote({
      ...newNote,
      subject_color: selectedColor
    }, user.id);
    if (success) {
      resetEditor();
      toast({
        title: "Success",
        description: "Note created successfully!"
      });
    }
  };

  const handleGenerateFlashcards = async (note: Note) => {
    await generateFlashcards(note.id);
  };

  const clearFilters = () => {
    setSelectedColor(null);
    setSelectedDate(null);
    setSearchQuery("");
    // Clear the subject from URL params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("subject");
    setSearchParams(newSearchParams);
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  const handleGenerateSummary = async () => {
    if (!selectedNote || !editingNote) return;
    const summary = await generateSummary(selectedNote);
    if (summary) {
      setEditingNote(prev => prev ? {
        ...prev,
        summary
      } : null);
      setShowSummary(true);
    }
  };
  const updateNote = async () => {
    if (!editingNote) return;
    try {
      const {
        error
      } = await supabase.from("notes").update({
        title: editingNote.title,
        content: editingNote.content,
        summary: editingNote.summary,
        tags: editingNote.tags || [],
        subject: editingNote.subject
      }).eq("id", editingNote.id);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Note updated successfully!"
      });
      setSelectedNote(null);
      setEditingNote(null);
      setShowSummary(false);
      fetchNotes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Failed to update note. Please try again."
      });
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setEditingNote(note);
  };

  return (
    <div className="mx-auto max-w-[min(100%,64rem)] flex flex-col space-y-4 h-full py-0 px-[10px]">
      <div className="flex-none">
        <NotesHeader onSearch={setSearchQuery} />
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
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg">
        <NotesContainer
          notes={filteredNotes}
          loading={loading}
          generatingFlashcardsForNote={generatingFlashcardsForNote}
          selectedColor={selectedColor}
          selectedSubject={currentSubject}
          selectedDate={selectedDate}
          uniqueSubjects={uniqueSubjects}
          onColorChange={setSelectedColor}
          onSubjectChange={() => {}}
          onDateChange={setSelectedDate}
          onClearFilters={() => {
            setSelectedColor(null);
            setSelectedDate(null);
            setSearchQuery("");
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("subject");
            setSearchParams(newSearchParams);
          }}
          onNoteClick={handleNoteClick}
          onGenerateFlashcards={handleGenerateFlashcards}
          onNotesChanged={fetchNotes}
        />
      </div>

      <EditNoteDialog
        open={!!selectedNote}
        onOpenChange={open => {
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
