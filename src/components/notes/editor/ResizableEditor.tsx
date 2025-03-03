
import { forwardRef } from "react";
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
  return (
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
        ref={ref}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={onContentChange}
        dangerouslySetInnerHTML={{ 
          __html: editingNote?.content 
            ? `<ReactMarkdown>${editingNote.content}</ReactMarkdown>` 
            : '<p>Write your notes here...</p>' 
        }}
      />
      
      <div 
        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-muted transition-colors rounded-b-lg"
        onMouseDown={onResizeStart}
        title="Drag to resize"
      />
    </div>
  );
});

ResizableEditor.displayName = "ResizableEditor";
