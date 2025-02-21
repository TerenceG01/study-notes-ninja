
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteEditor } from "./NoteEditor";
import { CommonSubjects } from "./CommonSubjects";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";

interface NotesHeaderProps {
  onSearch: (query: string) => void;
}

export const NotesHeader = ({
  onSearch
}: NotesHeaderProps) => {
  const { user } = useAuth();
  const { createNote } = useNotes();
  const { 
    isEditorExpanded, 
    setIsEditorExpanded, 
    newNote, 
    newTag,
    setNewTag,
    handleNoteChange,
    addTag,
    removeTag,
    resetEditor
  } = useNoteEditor();
  const { toast } = useToast();

  const handleCreateNote = () => {
    console.log("Creating new note..."); // Debug log
    setIsEditorExpanded(true);
    toast({
      title: "Create Note",
      description: "Opening note editor...",
    });
  };

  const handleSave = async () => {
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

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-6 rounded-lg shadow-sm border border-border/50">
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
            <Input placeholder="Search notes..." className="pl-10" onChange={e => onSearch(e.target.value)} />
          </div>
          <Button
            onClick={handleCreateNote}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isEditorExpanded} onOpenChange={setIsEditorExpanded}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <NoteEditor
            note={newNote}
            newTag={newTag}
            commonSubjects={CommonSubjects}
            onNoteChange={handleNoteChange}
            onTagChange={setNewTag}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            onCancel={() => setIsEditorExpanded(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
