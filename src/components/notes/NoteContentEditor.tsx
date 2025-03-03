import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";
import { useRef, useState, useEffect } from "react";
import { TextFormattingToolbar } from "./TextFormattingToolbar";

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
  const editorRef = useRef<HTMLDivElement>(null);
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
    if (resizeStartPosRef.current === null || !editorRef.current) return;
    
    const deltaY = e.clientY - resizeStartPosRef.current;
    const currentHeight = editorRef.current.offsetHeight;
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

  // WYSIWYG content change handler
  const handleContentChange = () => {
    if (!editingNote || !editorRef.current) return;
    
    const content = editorRef.current.innerHTML;
    onNoteChange({
      ...editingNote,
      content: content
    });
  };

  // Format text based on the command
  const handleFormatText = (command: string, value?: string) => {
    if (command === 'createLink') {
      const url = prompt('Enter the URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else if (command === 'formatCode') {
      document.execCommand('insertHTML', false, '<pre><code>' + 
        window.getSelection()?.toString() + '</code></pre>');
    } else if (command === 'h1') {
      document.execCommand('formatBlock', false, '<h1>');
    } else if (command === 'h2') {
      document.execCommand('formatBlock', false, '<h2>');
    } else if (command === 'h3') {
      document.execCommand('formatBlock', false, '<h3>');
    } else if (value) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false);
    }
    
    // Make sure to update the content after formatting
    handleContentChange();
    
    // Ensure editor keeps focus after formatting
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleFormatText('bold');
            break;
          case 'i':
            e.preventDefault();
            handleFormatText('italic');
            break;
          case 'u':
            e.preventDefault();
            handleFormatText('underline');
            break;
          // 's' is handled by the save shortcut in parent component
          default:
            break;
        }
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (editor) {
        editor.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  // Focus editor on initial load
  useEffect(() => {
    if (editorRef.current && !showSummary) {
      editorRef.current.focus();
    }
  }, [showSummary]);

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
        <div className="flex flex-col h-full flex-1">
          <TextFormattingToolbar onFormatText={handleFormatText} />
          <div className="relative flex-1 p-2">
            <div 
              ref={editorRef}
              contentEditable={true}
              dangerouslySetInnerHTML={{ __html: editingNote?.content || "" }}
              onInput={handleContentChange}
              className="h-full flex-grow overflow-y-auto flex-1 p-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-background rounded-lg"
              style={{
                height: textareaHeight,
                minHeight: "300px"
              }}
              data-placeholder="Write your notes here..."
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
