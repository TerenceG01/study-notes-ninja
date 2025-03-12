
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Home, Plus } from "lucide-react";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useNotes } from "@/hooks/useNotes";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { CommonSubjects } from "@/components/notes/CommonSubjects";
import { navigationItems } from "./NavigationItems";

export const MobileNavigationBar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  const isHomeActive = location.pathname === '/';

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-sm">
        <div className="grid grid-cols-5 w-full max-w-screen-xl mx-auto">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center py-2 ${isHomeActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium mt-1">Home</span>
          </Link>
          
          {user && (
            <>
              {navigationItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.path} 
                  className={`flex flex-col items-center justify-center py-2 ${item.activeCheck(location.pathname) ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium mt-1">{item.mobileLabel || item.label}</span>
                </Link>
              ))}
              
              <div className="flex justify-center items-center">
                <Button 
                  onClick={handleCreateNote}
                  className="rounded-full bg-primary hover:bg-primary/90 h-12 w-12 p-0 flex items-center justify-center border-4 border-background shadow-lg"
                >
                  <Plus className="h-5 w-5 text-white" />
                </Button>
              </div>
            </>
          )}
          
          {!user && (
            <Button 
              variant="ghost" 
              className="flex flex-col items-center justify-center py-2 text-muted-foreground"
              onClick={() => setShowProfileModal(true)}
            >
              <p>Login</p>
            </Button>
          )}
        </div>
      </div>
      
      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />

      <Sheet open={isEditorExpanded} onOpenChange={setIsEditorExpanded}>
        <SheetContent
          side="top"
          className="h-screen w-screen p-4 overflow-y-auto"
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
