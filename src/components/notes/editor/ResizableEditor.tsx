
import { forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Note } from "@/hooks/useNotes";
import ReactMarkdown from "react-markdown";

interface ResizableEditorProps {
  editingNote: Note | null;
  textareaHeight: string;
  onContentChange: () => void;
  onResizeStart: (e: React.MouseEvent) => void;
}

export const ResizableEditor = forwardRef<HTMLDivElement, ResizableEditorProps>(({
  editingNote,
  textareaHeight,
  onContentChange,
  onResizeStart
}, ref) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // Update markdown content when editingNote changes
  useEffect(() => {
    if (editingNote?.content) {
      setMarkdownContent(editingNote.content);
    } else {
      setMarkdownContent('');
    }
  }, [editingNote]);

  // Handle content changes and update markdown
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerText;
    setMarkdownContent(content);
    onContentChange();
  };

  return (
    <div className="relative flex-1 p-2">
      {isEditing ? (
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
          ref={ref}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onBlur={() => setIsEditing(false)}
        >
          {markdownContent || "Write your notes here..."}
        </div>
      ) : (
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
          onClick={() => setIsEditing(true)}
        >
          {markdownContent ? (
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          ) : (
            <p>Write your notes here...</p>
          )}
        </div>
      )}
      
      <div 
        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-muted transition-colors rounded-b-lg"
        onMouseDown={onResizeStart}
        title="Drag to resize"
      />
    </div>
  );
});

ResizableEditor.displayName = "ResizableEditor";
