
import { Note } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import "./editor/editor.css"; // Import the same editor CSS that RichTextEditor uses

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
    <div className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-background text-foreground">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onExit} 
        className="absolute top-4 right-4 z-50"
        aria-label="Exit lecture mode"
      >
        <X className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 p-2 sm:p-4 max-w-4xl mx-auto w-full" style={{ overflowY: "auto" }}>
        {/* Match the exact styling of the editor content area */}
        <div 
          className="ProseMirror prose-sm sm:prose max-w-none focus:outline-none" 
          dangerouslySetInnerHTML={{ __html: note?.content || "" }}
          style={{ padding: "1rem", maxWidth: "100%" }}
        />
      </div>
    </div>
  );
};
