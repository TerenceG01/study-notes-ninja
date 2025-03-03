
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
    <div className="mt-4 min-h-[300px] flex flex-col h-full bg-card rounded-lg border border-border shadow-sm">
      {showSummary && editingNote?.summary ? (
        <Card className="p-6 bg-muted h-full overflow-auto rounded-lg border-none shadow-none">
          <div className="prose max-w-none">
            {editingNote.summary.split('\n').map((line, index) => (
              <p key={index} className="mb-3 text-foreground/90">{line}</p>
            ))}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col h-full flex-1 p-2">
          <div className="relative flex-1">
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
              className="flex-grow resize-none flex-1 p-4 border-none focus-visible:ring-1 shadow-none bg-background rounded-lg" 
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-muted transition-colors rounded-b-lg"
              onMouseDown={handleResizeStart}
              title="Drag to resize"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground pt-3 px-4 pb-2">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{wordCount} words</span>
            </div>
            <div className="italic">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+S</kbd> to save
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
