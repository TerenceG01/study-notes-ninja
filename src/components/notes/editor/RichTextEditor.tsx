
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { RichTextToolbar } from "./RichTextToolbar";
import { cn } from "@/lib/utils";
import "./editor.css";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  autofocus?: boolean;
  editable?: boolean;
  height?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing...",
  className,
  autofocus = false,
  editable = true,
  height = "300px",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content,
    editable,
    autofocus,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose-sm sm:prose max-w-none focus:outline-none',
        style: 'max-width: 100%', // Ensure content stays within container
      },
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editor) return;
      
      // Save with Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  // If the content from parent changes, update the editor
  useEffect(() => {
    if (editor && content !== editor.getHTML() && isMounted) {
      editor.commands.setContent(content);
    }
  }, [content, editor, isMounted]);

  return (
    <div className={cn("flex flex-col rounded-md border overflow-hidden max-w-full relative editor-content-container", className)}>
      {editable && <RichTextToolbar editor={editor} />}
      <div 
        className="flex-grow overflow-auto"
        style={{ 
          height: height,
          maxHeight: height,
        }}
      >
        <EditorContent
          editor={editor}
          className="prose max-w-none p-2 sm:p-4 h-full"
        />
      </div>
    </div>
  );
};
