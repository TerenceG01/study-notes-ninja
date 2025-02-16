
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NotesTable } from "@/components/notes/NotesTable";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NotesHeader } from "@/components/notes/NotesHeader";
import { NotesActionCards } from "@/components/notes/NotesActionCards";
import { useNotes, type Note } from "@/hooks/useNotes";
import { supabase } from "@/integrations/supabase/client"; // Add this import
import { useToast } from "@/hooks/use-toast"; // Add this import

type SummaryLevel = 'brief' | 'medium' | 'detailed';

const Notes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { toast } = useToast(); // Add this hook
  const isOpen = state === "expanded";
  const { notes, loading, generatingFlashcardsForNote, fetchNotes, createNote, generateFlashcards } = useNotes();
  
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: [] as string[], subject: "General" });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>('medium');
  const [showSummary, setShowSummary] = useState(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [newTag, setNewTag] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

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

  const handleNoteChange = (field: string, value: string | string[]) => {
    setNewNote(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag && !newNote.tags.includes(newTag)) {
      setNewNote({
        ...newNote,
        tags: [...newNote.tags, newTag]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleCreateNote = async () => {
    if (!user) return;
    const success = await createNote(newNote, user.id);
    if (success) {
      setNewNote({ title: "", content: "", tags: [], subject: "General" });
      setIsEditorExpanded(false);
    }
  };

  const generateSummary = async () => {
    if (!selectedNote) return;

    try {
      setSummarizing(true);
      const { data, error } = await supabase.functions.invoke('summarize-note', {
        body: {
          content: selectedNote.content,
          level: summaryLevel,
        },
      });

      if (error) throw error;

      if (data?.summary) {
        setEditingNote(prev => prev ? { ...prev, summary: data.summary } : null);
        setShowSummary(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating summary",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setSummarizing(false);
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

      {isEditorExpanded && (
        <Card className="mb-6 border-primary/20 animate-fade-in max-w-5xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="text-lg font-medium">Create New Note</CardTitle>
            <CardDescription>Add a new note to your collection</CardDescription>
          </CardHeader>
          <CardContent className="p-6" ref={editorRef}>
            <NoteEditor
              note={newNote}
              newTag={newTag}
              commonSubjects={commonSubjects}
              onNoteChange={handleNoteChange}
              onTagChange={setNewTag}
              onAddTag={addTag}
              onRemoveTag={removeTag}
              onCancel={() => {
                setIsEditorExpanded(false);
                setNewNote({ title: "", content: "", tags: [], subject: "General" });
              }}
              onSave={handleCreateNote}
            />
          </CardContent>
        </Card>
      )}

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
        onGenerateSummary={generateSummary}
        onToggleSummary={() => setShowSummary(!showSummary)}
        onNewTagChange={setNewTag}
        onSave={updateNote}
      />
    </div>
  );
};

export default Notes;
