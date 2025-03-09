
import { FileText, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";
import { useRef, useState, useEffect } from "react";
import { RichTextEditor } from "./editor/RichTextEditor";
import "./editor/editor.css";

interface NoteContentEditorProps {
  editingNote: Note | null;
  showSummary: boolean;
  isFullscreen: boolean;
  wordCount: number;
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  onNoteChange: (note: Note | null) => void;
  onToggleAutoSave: () => void;
}

export const NoteContentEditor = ({
  editingNote,
  showSummary,
  isFullscreen,
  wordCount,
  autoSaveEnabled,
  lastSaved,
  onNoteChange,
  onToggleAutoSave
}: NoteContentEditorProps) => {
  // Default heights based on fullscreen mode and device
  const getDefaultHeight = () => {
    if (window.innerWidth < 640) { // Mobile
      return isFullscreen ? "calc(100vh - 200px)" : "calc(100vh - 350px)";
    }
    return isFullscreen ? "calc(100vh - 250px)" : "calc(100vh - 450px)";
  };
  
  const [editorHeight, setEditorHeight] = useState(getDefaultHeight());
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeStartPosRef = useRef<number | null>(null);
  
  // Update default height when fullscreen mode changes or on resize
  useEffect(() => {
    setEditorHeight(getDefaultHeight());
    
    const handleResize = () => {
      setEditorHeight(getDefaultHeight());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // Handle mouse down for resize
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeStartPosRef.current = e.clientY;
    
    // Add event listeners for mouse move and mouse up
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle mouse move for resizing
  const handleResize = (e: MouseEvent) => {
    if (resizeStartPosRef.current === null || !containerRef.current) return;
    
    const deltaY = e.clientY - resizeStartPosRef.current;
    const currentHeight = containerRef.current.offsetHeight;
    const newHeight = Math.max(200, currentHeight + deltaY); // Minimum height of 200px
    
    setEditorHeight(`${newHeight}px`);
    resizeStartPosRef.current = e.clientY;
  };

  // Handle mouse up to end resize
  const handleResizeEnd = () => {
    resizeStartPosRef.current = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // Handle content change from editor
  const handleContentChange = (html: string) => {
    if (!editingNote) return;
    
    onNoteChange({
      ...editingNote,
      content: html
    });
  };

  return (
    <div className="mt-4 min-h-[300px] flex flex-col h-full bg-card rounded-lg border border-border shadow-sm max-w-full overflow-hidden">
      {showSummary && editingNote?.summary ? (
        <Card className="p-3 sm:p-6 bg-muted h-full overflow-auto rounded-lg border-none shadow-none">
          <div className="prose max-w-none break-words">
            {editingNote.summary.split('\n').map((line, index) => (
              <p key={index} className="mb-3 text-foreground/90 text-sm sm:text-base">{line}</p>
            ))}
          </div>
        </Card>
      ) : (
        <div ref={containerRef} className="flex flex-col h-full flex-1 p-2 relative max-w-full overflow-hidden">
          <RichTextEditor
            content={editingNote?.content || ""}
            onChange={handleContentChange}
            placeholder="Start writing your notes here..."
            height={editorHeight}
            className="flex-grow rounded-lg border-none shadow-none overflow-hidden max-w-full"
          />
          
          <div 
            className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-muted transition-colors rounded-b-lg"
            onMouseDown={handleResizeStart}
            title="Drag to resize"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground pt-3 px-2 sm:px-4 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{wordCount} words</span>
            </div>
            <div className="italic text-[10px] sm:text-xs">
              Press <kbd className="px-1 sm:px-1.5 py-0.5 bg-muted rounded text-[9px] sm:text-[10px] font-mono">Ctrl+S</kbd> to save
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
