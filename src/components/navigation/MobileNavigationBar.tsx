
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Home, BookOpen, FileText, Users, Plus, Sparkles } from "lucide-react";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useNotes } from "@/hooks/useNotes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { CommonSubjects } from "@/components/notes/CommonSubjects";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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
      setIsEditorExpanded(false);
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
    }
  };

  // Determine if we're currently in the notes section
  const isNotesActive = location.pathname === '/notes';

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t py-1 md:hidden">
        <div className="flex justify-around items-center relative">
          <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs mt-0.5">Home</span>
          </Link>
          
          {user && (
            <>
              <Link to="/notes" className={`flex flex-col items-center ${isNotesActive ? 'text-primary' : 'text-muted-foreground'}`}>
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs mt-0.5">Notes</span>
              </Link>
              
              {/* Create note button with smooth pulse animation */}
              <div className="relative">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <Button 
                    onClick={handleCreateNote}
                    className="rounded-full bg-primary hover:bg-primary/90 h-16 w-16 p-0 flex items-center justify-center border-4 border-background shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-primary rounded-full opacity-80 hover:opacity-100 transition-opacity"></div>
                    <Plus className="h-7 w-7 text-white relative z-10" />
                  </Button>
                  <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-primary whitespace-nowrap">New Note</span>
                </div>
              </div>
              
              <Link to="/flashcards" className={`flex flex-col items-center ${location.pathname === '/flashcards' ? 'text-primary' : 'text-muted-foreground'}`}>
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs mt-0.5">Cards</span>
              </Link>
              
              <Link to="/study-groups" className={`flex flex-col items-center ${location.pathname === '/study-groups' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs mt-0.5">Groups</span>
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
              <span className="text-[10px] sm:text-xs mt-0.5">Login</span>
            </Button>
          )}
        </div>
      </div>
      
      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />

      {/* Use Sheet instead of Dialog on mobile for better UX */}
      <Sheet open={isEditorExpanded} onOpenChange={setIsEditorExpanded}>
        <SheetContent
          side="bottom"
          className="h-[85vh] p-4 overflow-y-auto rounded-t-xl"
        >
          <SheetHeader className="mb-4">
            <SheetTitle>Create New Note</SheetTitle>
          </SheetHeader>
          
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
        </SheetContent>
      </Sheet>
    </>
  );
};
