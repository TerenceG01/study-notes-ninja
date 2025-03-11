
import { Note } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
      
      <ScrollArea className="flex-1 py-8 px-4 md:px-16 md:py-12 max-w-4xl mx-auto w-full">
        {/* Use the exact same prose classes as in the RichTextEditor component */}
        <div 
          className="prose-sm sm:prose max-w-none focus:outline-none"
          dangerouslySetInnerHTML={{ __html: note?.content || "" }}
          style={{ maxWidth: '100%' }}
        />
      </ScrollArea>
    </div>
  );
};
