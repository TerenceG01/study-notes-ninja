
import { useRef, useState, useEffect } from "react";
import { Note } from "@/hooks/useNotes";
import { TextFormattingToolbar } from "./TextFormattingToolbar";
import { ResizableEditor } from "./editor/ResizableEditor";
import { EditorFooter } from "./editor/EditorFooter";
import { SummaryView } from "./editor/SummaryView";
import { applyFormatting, getEmptyFormatting } from "./editor/TextFormattingUtils";

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
        let formattedText = getEmptyFormatting(formatType);
        
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
          // Use the updated content
          const updatedContent = editorRef.current.innerText;
          onNoteChange({
            ...editingNote,
            content: updatedContent
          });
        }
      }
      return;
    }
    
    const { selection, range } = selectionData;
    const selectedText = range.toString();
    
    if (selectedText.trim() === '') return;
    
    // Apply formatting based on type
    const formattedText = applyFormatting(formatType, selectedText);
    
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
        <SummaryView editingNote={editingNote} />
      ) : (
        <div className="flex flex-col h-full flex-1">
          {/* Text formatting toolbar */}
          <TextFormattingToolbar onFormatText={handleFormatText} />
          
          <ResizableEditor
            ref={editorRef}
            editingNote={editingNote}
            textareaHeight={textareaHeight}
            onContentChange={handleContentChange}
            onResizeStart={handleResizeStart}
          />
          
          <EditorFooter wordCount={wordCount} />
        </div>
      )}
    </div>
  );
};
