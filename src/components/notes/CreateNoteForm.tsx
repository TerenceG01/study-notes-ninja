
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type CreateNoteFormProps = {
  onNoteCreated: () => void;
};

export const CreateNoteForm = ({ onNoteCreated }: CreateNoteFormProps) => {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState({ title: "", content: "" });

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
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note created successfully!",
      });

      setNewNote({ title: "", content: "" });
      onNoteCreated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating note",
        description: "Failed to create note. Please try again.",
      });
    }
  };

  return (
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
  );
};
