import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, Hash, BookOpen, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

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

  if (!user) return null;
  const { state, toggleSidebar } = useSidebar();
  const isOpen = state === "expanded";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background border shadow-sm shrink-0"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
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
              <div className="space-y-4 animate-fade-in">
                <Input
                  placeholder="Note Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="text-lg font-medium"
                />

                <Select
                  value={newNote.subject}
                  onValueChange={(value) => setNewNote({ ...newNote, subject: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonSubjects.map((subject) => (
                      <SelectItem 
                        key={subject} 
                        value={subject}
                        className="hover:bg-muted cursor-pointer"
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Write your note here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="min-h-[200px] resize-y"
                />

                <div className="flex flex-wrap gap-2 items-center">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  {newNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-1 hover:bg-secondary/80 transition-colors"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive ml-1"
                        aria-label={`Remove ${tag} tag`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newTag) {
                        addTag();
                      }
                    }}
                    className="!mt-0 w-32 h-8 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditorExpanded(false);
                      setNewNote({ title: "", content: "", tags: [], subject: "General" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={createNote}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Save Note
                  </Button>
                </div>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Content</TableHead>
                  <TableHead className="hidden sm:table-cell">Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        <span className="text-muted-foreground">Loading notes...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : notes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">No notes found. Create your first note above!</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  notes.map((note) => (
                    <TableRow 
                      key={note.id}
                      className="group hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <TableCell 
                        className="font-medium"
                        onClick={() => {
                          setSelectedNote(note);
                          setEditingNote(note);
                          setShowSummary(false);
                        }}
                      >
                        {note.title}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setSelectedNote(note);
                          setEditingNote(note);
                          setShowSummary(false);
                        }}
                      >
                        {note.subject || 'General'}
                      </TableCell>
                      <TableCell 
                        className="max-w-md truncate hidden md:table-cell"
                        onClick={() => {
                          setSelectedNote(note);
                          setEditingNote(note);
                          setShowSummary(false);
                        }}
                      >
                        {note.content}
                      </TableCell>
                      <TableCell 
                        className="hidden sm:table-cell"
                        onClick={() => {
                          setSelectedNote(note);
                          setEditingNote(note);
                          setShowSummary(false);
                        }}
                      >
                        {new Date(note.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateFlashcards(note)}
                          disabled={!!generatingFlashcardsForNote}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                        >
                          {generatingFlashcardsForNote === note.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-4 w-4" />
                              Create Flashcards
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog 
        open={!!selectedNote} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNote(null);
            setEditingNote(null);
            setShowSummary(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              <Input
                value={editingNote?.title || ""}
                onChange={(e) => setEditingNote(editingNote ? { ...editingNote, title: e.target.value } : null)}
                className="text-xl font-semibold"
              />
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <Select
              value={editingNote?.subject || "General"}
              onValueChange={(value) => setEditingNote(editingNote ? { ...editingNote, subject: value } : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {commonSubjects.map((subject) => (
                  <SelectItem 
                    key={subject} 
                    value={subject}
                    className="hover:bg-muted cursor-pointer"
                  >
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 items-center mt-4">
            <Select
              value={summaryLevel}
              onValueChange={(value: SummaryLevel) => setSummaryLevel(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Summary Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief (30%)</SelectItem>
                <SelectItem value="medium">Medium (50%)</SelectItem>
                <SelectItem value="detailed">Detailed (70%)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={generateSummary}
              disabled={summarizing}
              variant="secondary"
            >
              {summarizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                'Generate Summary'
              )}
            </Button>

            {editingNote?.summary && (
              <Button
                variant="outline"
                onClick={() => setShowSummary(!showSummary)}
              >
                {showSummary ? 'Show Original' : 'Show Summary'}
              </Button>
            )}
          </div>

          <div className="mt-4">
            {showSummary && editingNote?.summary ? (
              <Card className="p-4 bg-muted/50">
                <div className="prose max-w-none">
                  {editingNote.summary.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              </Card>
            ) : (
              <Textarea
                value={editingNote?.content || ""}
                onChange={(e) => setEditingNote(editingNote ? { ...editingNote, content: e.target.value } : null)}
                className="min-h-[300px] resize-y"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center mt-4">
            <Hash className="h-4 w-4 text-muted-foreground" />
            {editingNote?.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-1 hover:bg-secondary/80 transition-colors"
              >
                {tag}
                <button
                  onClick={() => setEditingNote({
                    ...editingNote,
                    tags: editingNote.tags?.filter(t => t !== tag) || []
                  })}
                  className="hover:text-destructive ml-1"
                >
                  ×
                </button>
              </span>
            ))}
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newTag && editingNote) {
                  setEditingNote({
                    ...editingNote,
                    tags: [...(editingNote.tags || []), newTag]
                  });
                  setNewTag("");
                }
              }}
              className="!mt-0 w-32 h-8 text-sm"
            />
          </div>

          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => {
              setSelectedNote(null);
              setEditingNote(null);
              setShowSummary(false);
            }}>
              Cancel
            </Button>
            <Button onClick={updateNote}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notes;
