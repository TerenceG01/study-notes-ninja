
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

  // Create a contenteditable div that will be used for editing
  // but style it with Markdown rendering for a WYSIWYG experience
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
        onInput={handleInput}
        dangerouslySetInnerHTML={{ 
          __html: markdownContent ? 
            markdownContent
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/~~(.*?)~~/g, '<del>$1</del>')
              .replace(/^# (.*)$/gm, '<h1>$1</h1>')
              .replace(/^## (.*)$/gm, '<h2>$1</h2>')
              .replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>')
              .replace(/^(\d+)\. (.*)$/gm, '<ol><li>$2</li></ol>')
              .replace(/`(.*?)`/g, '<code>$1</code>')
              .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
              .replace(/\n/g, '<br/>') : 'Write your notes here...'
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
