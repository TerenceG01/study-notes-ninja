
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { CreateNoteForm } from "@/components/notes/CreateNoteForm";
import { NotesTable } from "@/components/notes/NotesTable";
import { NoteEditorDialog } from "@/components/notes/NoteEditorDialog";
import type { Note } from "@/types/notes";

const Notes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="container mx-auto py-8 px-4 pt-16">
        <h1 className="text-3xl font-bold mb-8">My Notes</h1>

        <div className="grid gap-6 mb-8">
          <CreateNoteForm onNoteCreated={fetchNotes} />
          <NotesTable
            notes={notes}
            loading={loading}
            onNoteSelect={setSelectedNote}
          />
        </div>
      </div>

      <NoteEditorDialog
        note={selectedNote}
        open={!!selectedNote}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNote(null);
          }
        }}
        onNoteUpdated={fetchNotes}
      />
    </div>
  );
};

export default Notes;
