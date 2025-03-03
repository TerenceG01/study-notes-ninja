
import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";
import { useRef, useState, useEffect } from "react";
import { TextFormattingToolbar } from "./TextFormattingToolbar";
import ReactMarkdown from "react-markdown";

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
  const defaultHeight = isFullscreen ? "calc(100vh - 300px)" : "calc(100vh - 500px)";
  const [textareaHeight, setTextareaHeight] = useState(defaultHeight);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resizeStartPosRef = useRef<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Update default height when fullscreen mode changes
  useEffect(() => {
    setTextareaHeight(isFullscreen ? "calc(100vh - 300px)" : "calc(100vh - 500px)");
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

  // Handles text formatting
  const handleFormatText = (formatType: string) => {
    if (!textareaRef.current || !editingNote) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editingNote.content.substring(start, end);
    
    let formattedText = '';
    let cursorOffset = 0;
    
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        cursorOffset = 3;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        cursorOffset = 2;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        cursorOffset = 2;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        cursorOffset = 3;
        break;
      case 'list-bullet':
        formattedText = selectedText
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        cursorOffset = 2;
        break;
      case 'list-numbered':
        formattedText = selectedText
          .split('\n')
          .map((line, i) => `${i + 1}. ${line}`)
          .join('\n');
        cursorOffset = 3;
        break;
      case 'align-left':
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        cursorOffset = 30;
        break;
      case 'align-center':
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        cursorOffset = 32;
        break;
      case 'align-right':
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        cursorOffset = 31;
        break;
      case 'code':
        formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
        cursorOffset = 4;
        break;
      case 'quote':
        formattedText = selectedText
          .split('\n')
          .map(line => `> ${line}`)
          .join('\n');
        cursorOffset = 2;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = 
      editingNote.content.substring(0, start) + 
      formattedText + 
      editingNote.content.substring(end);
    
    onNoteChange({
      ...editingNote,
      content: newContent
    });
    
    // Set the selection and focus after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        if (selectedText.length > 0) {
          textareaRef.current.setSelectionRange(start, start + formattedText.length);
        } else {
          const newPosition = start + formattedText.length - cursorOffset;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }
    }, 0);
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
        <div className="flex flex-col h-full flex-1">
          {/* Text formatting toolbar */}
          <TextFormattingToolbar 
            onFormatText={handleFormatText} 
            previewMode={previewMode}
            onTogglePreview={() => setPreviewMode(!previewMode)}
          />
          
          <div className="relative flex-1 p-2">
            {previewMode ? (
              <div 
                className="flex-grow p-4 h-full overflow-y-auto bg-background rounded-lg prose prose-sm max-w-none dark:prose-invert"
                style={{ 
                  height: textareaHeight,
                  minHeight: "300px" 
                }}
              >
                <ReactMarkdown>
                  {editingNote?.content || ""}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex h-full">
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
                  className="flex-grow resize-none flex-1 p-4 border-none focus-visible:ring-1 shadow-none bg-background rounded-lg font-mono" 
                />
                <div 
                  className="flex-grow p-4 ml-2 h-full overflow-y-auto bg-background rounded-lg prose prose-sm max-w-none dark:prose-invert border border-border/30"
                  style={{ 
                    height: textareaHeight,
                    minHeight: "300px" 
                  }}
                >
                  <ReactMarkdown>
                    {editingNote?.content || ""}
                  </ReactMarkdown>
                </div>
              </div>
            )}
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
