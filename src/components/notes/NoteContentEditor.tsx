
import { FileText, Clock, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";
import { useState, useEffect } from "react";
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
  
  // Calculate editor height based on available space and add padding for the bottom bar
  const getDefaultHeight = () => {
    if (isFullscreen) {
      return isMobile ? "calc(100vh - 230px)" : "calc(100vh - 260px)";
    } else {
      return isMobile ? "calc(100vh - 340px)" : "calc(100vh - 300px)";
    }
  };
  
  const [editorHeight, setEditorHeight] = useState(getDefaultHeight());
  
  // Update height when fullscreen mode changes or on resize
  useEffect(() => {
    setEditorHeight(getDefaultHeight());
    
    const handleResize = () => {
      setEditorHeight(getDefaultHeight());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // Handle content change from editor
  const handleContentChange = (html: string) => {
    if (!editingNote) return;
    
    onNoteChange({
      ...editingNote,
      content: html
    });
  };

  return (
    <div className="mt-2 mb-16 min-h-[150px] flex flex-col bg-card rounded-lg border border-border shadow-sm max-w-full overflow-hidden">
      {showSummary && editingNote?.summary ? (
        <Card className="p-3 sm:p-4 bg-muted h-full overflow-auto rounded-lg border-none shadow-none">
          <div className="prose max-w-none break-words">
            {editingNote.summary.split('\n').map((line, index) => (
              <p key={index} className="mb-2 text-foreground/90 text-sm">{line}</p>
            ))}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col h-full flex-1 relative max-w-full overflow-hidden">
          <RichTextEditor
            content={editingNote?.content || ""}
            onChange={handleContentChange}
            placeholder="Start writing your notes here..."
            height={editorHeight}
            className="flex-grow rounded-lg border-none shadow-none overflow-hidden max-w-full"
          />
          
          <div className="flex justify-between items-center text-xs text-muted-foreground px-3 py-2 border-t border-border bg-card/50">
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
  );
};
