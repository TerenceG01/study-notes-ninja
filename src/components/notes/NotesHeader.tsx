
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CommonSubjects } from "./CommonSubjects";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";
import { useFullscreenState } from "@/hooks/useFullscreenState";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { CreateNoteContainer } from "./CreateNoteContainer";
import { DialogFooterActions } from "./DialogFooterActions";

interface NotesHeaderProps {
  onSearch: (query: string) => void;
}

export const NotesHeader = ({ onSearch }: NotesHeaderProps) => {
  const { user } = useAuth();
  const { createNote } = useNotes();
  const { 
    isEditorExpanded, 
    setIsEditorExpanded, 
    newNote, 
    handleNoteChange,
    resetEditor
  } = useNoteEditor();
  const { toast } = useToast();
  const { isFullscreen, enableFullscreen, toggleFullscreen } = useFullscreenState();
  const isMobile = useIsMobile();
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [lectureMode, setLectureMode] = useState(false);

  const handleCreateNote = () => {
    setIsEditorExpanded(true);
    enableFullscreen(); // Always open in fullscreen
    toast({
      title: "Create Note",
      description: "Opening note editor...",
    });
  };

  const handleNoteContentChange = (content: string) => {
    handleNoteChange('content', content);
    
    if (content) {
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const success = await createNote(newNote, user.id);
    if (success) {
      setIsSaved(true);
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Note created successfully!",
      });
      setTimeout(() => {
        resetEditor();
        setIsEditorExpanded(false);
        setIsSaved(false);
      }, 1000);
    }
  };

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };

  const toggleLectureMode = () => {
    setLectureMode(!lectureMode);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-10" onChange={e => onSearch(e.target.value)} />
          </div>
          <Button onClick={handleCreateNote} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      <Sheet open={isEditorExpanded} onOpenChange={setIsEditorExpanded}>
        <SheetContent
          side="top"
          className="h-screen w-screen p-6 flex flex-col max-h-screen overflow-hidden bg-background"
        >
          <div className="flex flex-col h-full overflow-hidden">
            <CreateNoteContainer
              newNote={{
                id: '',
                title: newNote.title,
                content: newNote.content,
                subject: newNote.subject,
                created_at: new Date().toISOString(),
                folder: 'My Notes'
              }}
              isFullscreen={isFullscreen}
              wordCount={wordCount}
              lastSaved={lastSaved}
              autoSaveEnabled={autoSaveEnabled}
              commonSubjects={CommonSubjects}
              onNoteChange={handleNoteChange}
              onNoteContentChange={handleNoteContentChange}
              onToggleAutoSave={toggleAutoSave}
              onToggleLectureMode={toggleLectureMode}
            />
            
            <DialogFooterActions
              onSave={handleSave}
              onCancel={() => setIsEditorExpanded(false)}
              isSaved={isSaved}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
