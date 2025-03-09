
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Home, BookOpen, FileText, Users, Plus } from "lucide-react";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useNotes } from "@/hooks/useNotes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { CommonSubjects } from "@/components/notes/CommonSubjects";

export const MobileNavigationBar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Use the note editor hooks for creating a new note
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

  const handleCreateNote = () => {
    setIsEditorExpanded(true);
    toast({
      title: "Create Note",
      description: "Opening note editor...",
    });
  };

  const handleSaveNote = async () => {
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
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t py-1.5 md:hidden">
        <div className="flex justify-around items-center relative">
          <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Home</span>
          </Link>
          
          {user && (
            <>
              <Link to="/notes" className={`flex flex-col items-center ${location.pathname === '/notes' ? 'text-primary' : 'text-muted-foreground'}`}>
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Notes</span>
              </Link>
              
              {/* Create note button - positioned absolutely to be in the middle and elevated */}
              <Button 
                onClick={handleCreateNote}
                className="absolute -top-7 left-1/2 transform -translate-x-1/2 rounded-full bg-primary hover:bg-primary/90 h-14 w-14 p-0 flex items-center justify-center border-4 border-background shadow-lg"
              >
                <Plus className="h-6 w-6 text-primary-foreground" />
              </Button>
              
              <Link to="/flashcards" className={`flex flex-col items-center ${location.pathname === '/flashcards' ? 'text-primary' : 'text-muted-foreground'}`}>
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Cards</span>
              </Link>
              
              <Link to="/study-groups" className={`flex flex-col items-center ${location.pathname === '/study-groups' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Groups</span>
              </Link>
            </>
          )}
          
          {!user && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 flex flex-col items-center text-muted-foreground"
              onClick={() => setShowProfileModal(true)}
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">Login</span>
            </Button>
          )}
        </div>
      </div>
      
      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />

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
            onSave={handleSaveNote}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
