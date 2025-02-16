import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NotesTable } from "@/components/notes/NotesTable";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder: string;
  summary?: string;
  tags?: string[];
  subject?: string;
};

type SummaryLevel = 'brief' | 'medium' | 'detailed';

const Notes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: [] as string[], subject: "General" });
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>('medium');
  const [showSummary, setShowSummary] = useState(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [newTag, setNewTag] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [generatingFlashcardsForNote, setGeneratingFlashcardsForNote] = useState<string | null>(null);

  // List of common subjects
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

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchNotes();

    const handleClickOutside = (event: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        if (!newNote.title && !newNote.content) {
          setIsEditorExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching notes",
        description: "Failed to load your notes. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!newNote.title || !newNote.content) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in both title and content.",
      });
      return;
    }

    try {
      const { error } = await supabase.from("notes").insert([
        {
          title: newNote.title,
          content: newNote.content,
          tags: newNote.tags,
          subject: newNote.subject,
          user_id: user?.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note created successfully!",
      });

      setNewNote({ title: "", content: "", tags: [], subject: "General" });
      setIsEditorExpanded(false);
      fetchNotes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating note",
        description: "Failed to create note. Please try again.",
      });
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

  const generateFlashcards = async (note: Note) => {
    try {
      setGeneratingFlashcardsForNote(note.id);
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: {
          noteId: note.id,
          content: note.content,
          title: note.title,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: `Created ${data.flashcardsCount} flashcards! You can find them in your flashcard decks.`,
        });
        navigate(`/flashcards/${data.deckId}`);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating flashcards",
        description: "Failed to generate flashcards. Please try again.",
      });
    } finally {
      setGeneratingFlashcardsForNote(null);
    }
  };

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

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-primary">My Notes</h1>
          <p className="text-muted-foreground">Organize and manage your study materials</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg font-medium">Create New Note</CardTitle>
            <CardDescription>Add a new note to your collection</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!isEditorExpanded ? (
              <Button 
                onClick={() => setIsEditorExpanded(true)}
                className="w-full py-8 text-lg hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create a New Note
              </Button>
            ) : (
              <div ref={editorRef}>
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
                  onSave={createNote}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg font-medium">Your Notes</CardTitle>
            <CardDescription>Browse and manage your existing notes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
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
      </div>

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
