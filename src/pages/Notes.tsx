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
import { Card } from "@/components/ui/card";
import { Loader2, Hash } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder: string;
  summary?: string;
  tags?: string[];
};

type SummaryLevel = 'brief' | 'medium' | 'detailed';

const Notes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: [] as string[] });
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>('medium');
  const [showSummary, setShowSummary] = useState(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [newTag, setNewTag] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchNotes();

    // Handle clicks outside the editor
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
          user_id: user?.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note created successfully!",
      });

      setNewNote({ title: "", content: "", tags: [] });
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
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="container mx-auto py-8 px-4 pt-16">
        <h1 className="text-3xl font-bold mb-8">My Notes</h1>

        <div className="grid gap-6 mb-8">
          <div 
            ref={editorRef}
            className={`space-y-4 p-6 bg-card rounded-lg border transition-all duration-300 ${
              isEditorExpanded ? 'shadow-lg' : ''
            }`}
          >
            {!isEditorExpanded ? (
              <Button 
                onClick={() => setIsEditorExpanded(true)}
                className="w-full py-8 text-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Add a New Note
              </Button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <Input
                  placeholder="Note Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="text-lg font-semibold"
                  style={{ textTransform: 'capitalize' }}
                />

                <Textarea
                  id="new-note-content"
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
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive"
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
                    className="!mt-0 w-24 h-7 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditorExpanded(false);
                      setNewNote({ title: "", content: "", tags: [] });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createNote}>Save Note</Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Folder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : notes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No notes found. Create your first note above!
                    </TableCell>
                  </TableRow>
                ) : (
                  notes.map((note) => (
                    <TableRow 
                      key={note.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedNote(note);
                        setEditingNote(note);
                        setShowSummary(false);
                      }}
                    >
                      <TableCell>{note.title}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {note.content}
                      </TableCell>
                      <TableCell>
                        {new Date(note.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{note.folder}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
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
                className="mt-2 text-lg font-semibold"
                style={{ textTransform: 'capitalize' }}
              />
            </DialogTitle>
          </DialogHeader>

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
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </Card>
            ) : (
              <Textarea
                id="edit-note-content"
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
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => setEditingNote({
                    ...editingNote,
                    tags: editingNote.tags?.filter(t => t !== tag) || []
                  })}
                  className="hover:text-destructive"
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
              className="!mt-0 w-24 h-7 text-sm"
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
