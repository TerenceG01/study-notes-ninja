
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";
import { useRef, useState, useEffect } from "react";
import { TextFormattingToolbar } from "./TextFormattingToolbar";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

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
  const editorRef = useRef<HTMLDivElement>(null);
  const resizeStartPosRef = useRef<number | null>(null);
  
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

  // Get selection and content manipulation
  const getSelection = () => {
    if (!editorRef.current) return null;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return null;
    
    return { selection, range };
  };

  // Handles text formatting
  const handleFormatText = (formatType: string) => {
    if (!editorRef.current || !editingNote) return;
    
    const selectionData = getSelection();
    if (!selectionData) {
      // If no selection, place cursor and insert empty formatting
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let formattedText = '';
        
        switch (formatType) {
          case 'bold':
            formattedText = '**Bold text**';
            break;
          case 'italic':
            formattedText = '*Italic text*';
            break;
          case 'underline':
            formattedText = '<u>Underlined text</u>';
            break;
          case 'strikethrough':
            formattedText = '~~Strikethrough text~~';
            break;
          case 'h1':
            formattedText = '# Heading 1';
            break;
          case 'h2':
            formattedText = '## Heading 2';
            break;
          case 'list-bullet':
            formattedText = '- Bullet item';
            break;
          case 'list-numbered':
            formattedText = '1. Numbered item';
            break;
          case 'align-left':
            formattedText = '<div style="text-align: left">Left aligned text</div>';
            break;
          case 'align-center':
            formattedText = '<div style="text-align: center">Center aligned text</div>';
            break;
          case 'align-right':
            formattedText = '<div style="text-align: right">Right aligned text</div>';
            break;
          case 'code':
            formattedText = '```\nCode block\n```';
            break;
          case 'quote':
            formattedText = '> Quote';
            break;
          default:
            formattedText = '';
        }
        
        // Insert the formatted text at cursor position
        const textNode = document.createTextNode(formattedText);
        range.insertNode(textNode);
        
        // Move cursor to end of inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Update the note content
        if (editorRef.current) {
          onNoteChange({
            ...editingNote,
            content: editorRef.current.innerText
          });
        }
      }
      return;
    }
    
    const { selection, range } = selectionData;
    const selectedText = range.toString();
    
    if (selectedText.trim() === '') return;
    
    // Apply formatting based on type
    let formattedText = '';
    
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'list-bullet':
        formattedText = selectedText
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        break;
      case 'list-numbered':
        formattedText = selectedText
          .split('\n')
          .map((line, i) => `${i + 1}. ${line}`)
          .join('\n');
        break;
      case 'align-left':
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        break;
      case 'align-center':
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        break;
      case 'align-right':
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        break;
      case 'code':
        formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
        break;
      case 'quote':
        formattedText = selectedText
          .split('\n')
          .map(line => `> ${line}`)
          .join('\n');
        break;
      default:
        formattedText = selectedText;
    }
    
    // Create a document fragment with the new content
    const textNode = document.createTextNode(formattedText);
    
    // Replace the selected text with formatted text
    range.deleteContents();
    range.insertNode(textNode);
    
    // Position the cursor after the inserted content
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Update the note content
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerText;
      onNoteChange({
        ...editingNote,
        content: updatedContent
      });
    }
  };

  // Handle content change in contentEditable div
  const handleContentChange = () => {
    if (!editorRef.current || !editingNote) return;
    
    const content = editorRef.current.innerText;
    onNoteChange({
      ...editingNote,
      content
    });
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
          <TextFormattingToolbar onFormatText={handleFormatText} />
          
          <div className="relative flex-1 p-2">
            <div
              className={cn(
                "w-full h-full overflow-y-auto bg-background rounded-lg", 
                "prose prose-sm max-w-none dark:prose-invert",
                "px-4 py-3 focus:outline-none border border-input focus-visible:ring-1 focus-visible:ring-ring"
              )}
              style={{
                height: textareaHeight,
                minHeight: "300px"
              }}
              ref={editorRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onInput={handleContentChange}
              dangerouslySetInnerHTML={{ 
                __html: editingNote?.content 
                  ? `<ReactMarkdown>${editingNote.content}</ReactMarkdown>` 
                  : '<p>Write your notes here...</p>' 
              }}
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
