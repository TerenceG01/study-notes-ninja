
import { Note } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";

interface LectureModeProps {
  note: Note | null;
  onExit: () => void;
}

export const LectureMode = ({ note, onExit }: LectureModeProps) => {
  // Add keyboard shortcut to exit lecture mode with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit]);

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground">
      <header className="p-4 border-b border-border flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onExit} 
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{note?.title || "Untitled Note"}</h1>
        <div className="ml-2 px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground">
          Lecture Mode
        </div>
      </header>
      
      <ScrollArea className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
        <div 
          className="prose prose-sm md:prose-base max-w-none"
          dangerouslySetInnerHTML={{ __html: note?.content || "" }}
        />
      </ScrollArea>
      
      <footer className="p-4 border-t border-border text-center text-xs text-muted-foreground">
        Press ESC to exit lecture mode
      </footer>
    </div>
  );
};
