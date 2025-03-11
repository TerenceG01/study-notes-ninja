
import { FileText, Clock, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";
import { useRef, useState, useEffect } from "react";
import { RichTextEditor } from "./editor/RichTextEditor";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  
  // Calculate editor height based on available space
  const getDefaultHeight = () => {
    if (isFullscreen) {
      return isMobile ? "calc(100vh - 140px)" : "calc(100vh - 200px)";
    } else {
      return isMobile ? "calc(100vh - 260px)" : "400px";
    }
  };
  
  const [editorHeight, setEditorHeight] = useState(getDefaultHeight());
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeStartPosRef = useRef<number | null>(null);
  
  // Update height when fullscreen mode changes or on resize
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
    if (isMobile) return; // Disable resize on mobile
    
    e.preventDefault();
    resizeStartPosRef.current = e.clientY;
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle mouse move for resizing
  const handleResize = (e: MouseEvent) => {
    if (resizeStartPosRef.current === null || !containerRef.current) return;
    
    const deltaY = e.clientY - resizeStartPosRef.current;
    const currentHeight = containerRef.current.offsetHeight;
    const newHeight = Math.max(150, currentHeight + deltaY); // Min height 150px
    
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
    <>
      <div className="mt-2 min-h-[150px] max-h-[calc(100%-20px)] flex flex-col bg-card rounded-lg border border-border shadow-sm max-w-full overflow-hidden">
        {showSummary && editingNote?.summary ? (
          <Card className="p-2 sm:p-4 bg-muted h-full overflow-auto rounded-lg border-none shadow-none">
            <div className="prose max-w-none break-words">
              {editingNote.summary.split('\n').map((line, index) => (
                <p key={index} className="mb-2 text-foreground/90 text-sm">{line}</p>
              ))}
            </div>
          </Card>
        ) : (
          <div ref={containerRef} className="flex flex-col h-full flex-1 relative max-w-full overflow-hidden">
            <RichTextEditor
              content={editingNote?.content || ""}
              onChange={handleContentChange}
              placeholder="Start writing your notes here..."
              height={editorHeight}
              className="flex-grow rounded-lg border-none shadow-none overflow-hidden max-w-full"
            />
            
            {!isMobile && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-muted transition-colors rounded-b-lg"
                onMouseDown={handleResizeStart}
                title="Drag to resize"
              />
            )}
            
            <div className="flex justify-between items-center text-xs text-muted-foreground px-2 sm:px-3 py-1.5 sm:py-2 border-t border-border bg-card/50">
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>{wordCount} words</span>
              </div>
              {!isMobile && (
                <div className="italic text-[10px] sm:text-xs flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[9px] font-mono">Ctrl+S</kbd>
                  <span>to save</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
