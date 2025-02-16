<lov-codelov-code>
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, BookOpen, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NotesTable } from "@/components/notes/NotesTable";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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
  const { state } = useSidebar();
  const isOpen = state === "expanded";
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
    <div className={cn(
      "container px-1 py-6",
      "transition-all duration-300",
      isOpen ? "ml-28" : "ml-16", // Dramatically reduced from ml-36 to ml-28 when expanded
      "w-[calc(100%-1rem)]" // Minimal spacing with just 1rem
    )}>
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              My Notes
            </h1>
            <p className="text-muted-foreground">
              Organize and manage your study materials
            </p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search notes..." 
                className="pl-10"
                onChange={(e) => {
                  // Search functionality can be implemented here
                  console.log('Search:', e.target.value);
                }}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center"
              onClick={() => setIsEditorExpanded(true)}
            >
              <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mb-2">Create New Note</CardTitle>
              <CardDescription>Add a new note to your collection</CardDescription>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/20 transition-colors cursor-pointer"
            onClick={() => navigate('/flashcards')}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
              <div className="rounded-full bg-blue-500/10 p-4 mb-4">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="mb-2">Recent Flashcards</CardTitle>
              <CardDescription>View your flashcard decks</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {isEditorExpanded && (
        <Card className="mb-6 border-primary/20 animate-fade-in">
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
              onSave={createNote}
            />
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-muted/20">
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
</lov-code>
