
import { FileText, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";
import { useRef, useState, useEffect } from "react";

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
  // Default heights based on fullscreen mode
  const defaultHeight = isFullscreen ? "calc(100vh - 250px)" : "calc(100vh - 450px)";
  const [textareaHeight, setTextareaHeight] = useState(defaultHeight);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resizeStartPosRef = useRef<number | null>(null);
  
  // Update default height when fullscreen mode changes
  useEffect(() => {
    setTextareaHeight(isFullscreen ? "calc(100vh - 250px)" : "calc(100vh - 450px)");
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
    if (resizeStartPosRef.current === null || !textareaRef.current) return;
    
    const deltaY = e.clientY - resizeStartPosRef.current;
    const currentHeight = textareaRef.current.offsetHeight;
    const newHeight = Math.max(100, currentHeight + deltaY); // Minimum height of 100px
    
    setTextareaHeight(`${newHeight}px`);
    resizeStartPosRef.current = e.clientY;
  };

  // Handle mouse up to end resize
  const handleResizeEnd = () => {
    resizeStartPosRef.current = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  return (
    <div className="mt-6 min-h-[300px] flex flex-col h-full mx-[5px]">
      {showSummary && editingNote?.summary ? (
        <Card className="p-6 bg-muted/30 h-full overflow-auto rounded-lg border border-accent/50 shadow-sm">
          <div className="prose max-w-none">
            {editingNote.summary.split('\n').map((line, index) => (
              <p key={index} className="mb-3 text-foreground/90 leading-relaxed">{line}</p>
            ))}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col h-full flex-1">
          <div className="relative flex-1 rounded-lg overflow-hidden">
            <Textarea 
              ref={textareaRef}
              value={editingNote?.content || ""} 
              onChange={e => onNoteChange(editingNote ? {
                ...editingNote,
                content: e.target.value
              } : null)} 
              placeholder="Write your notes here..." 
              style={{
                height: textareaHeight,
                minHeight: "300px"
              }} 
              className="flex-grow resize-none rounded-lg border-accent/20 focus-visible:ring-primary/30 transition-all duration-200 p-4 text-base leading-relaxed" 
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-muted/70 transition-colors"
              onMouseDown={handleResizeStart}
              title="Drag to resize"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground pt-3">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>{wordCount} words</span>
            </div>
            <div className="italic">
              Press Ctrl+S to save
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
