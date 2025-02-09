
import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder: string;
  summary?: string;
};

type SummaryLevel = 'brief' | 'medium' | 'detailed';

const Notes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>('medium');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchNotes();
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
          user_id: user?.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note created successfully!",
      });

      setNewNote({ title: "", content: "" });
      fetchNotes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating note",
        description: "Failed to create note. Please try again.",
      });
    }
  };

  const updateNote = async () => {
    if (!editingNote || !editingNote.title || !editingNote.content) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in both title and content.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: editingNote.title,
          content: editingNote.content,
          summary: editingNote.summary,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingNote.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note updated successfully!",
      });

      setEditingNote(null);
      setSelectedNote(null);
      fetchNotes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Failed to update note. Please try again.",
      });
    }
  };

  const generateSummary = async () => {
    if (!editingNote) return;

    setSummarizing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize-note`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: editingNote.content,
            level: summaryLevel,
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setEditingNote({
        ...editingNote,
        summary: data.summary,
      });
      setShowSummary(true);

      toast({
        title: "Summary generated",
        description: "Your note has been summarized successfully!",
      });
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="container mx-auto py-8 px-4 pt-16">
        <h1 className="text-3xl font-bold mb-8">My Notes</h1>

        <div className="grid gap-6 mb-8">
          <div className="space-y-4 p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold">Create New Note</h2>
            <Input
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="mb-4"
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="min-h-[100px]"
            />
            <Button onClick={createNote}>Save Note</Button>
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
                className="mt-2"
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
                value={editingNote?.content || ""}
                onChange={(e) => setEditingNote(editingNote ? { ...editingNote, content: e.target.value } : null)}
                className="min-h-[300px]"
              />
            )}
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
