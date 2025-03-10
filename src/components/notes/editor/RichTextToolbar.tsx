import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Undo,
  Redo,
  Highlighter,
  Quote,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface RichTextToolbarProps {
  editor: Editor | null;
}

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ editor }) => {
  const isMobile = useIsMobile();
  const [toolbarSection, setToolbarSection] = React.useState(0);

  if (!editor) {
    return null;
  }

  // For mobile, split toolbar into sections to avoid overcrowding
  const toolbarSections = isMobile ? [
    // Section 1: Basic formatting
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bold") ? "bg-muted text-foreground" : ""
        )}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("italic") ? "bg-muted text-foreground" : ""
        )}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("underline") ? "bg-muted text-foreground" : ""
        )}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("highlight") ? "bg-muted text-foreground" : ""
        )}
        title="Highlight"
      >
        <Highlighter className="h-4 w-4" />
      </Button>
    </>,
    
    // Section 2: Headings and lists
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("heading", { level: 1 }) ? "bg-muted text-foreground" : ""
        )}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("heading", { level: 2 }) ? "bg-muted text-foreground" : ""
        )}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bulletList") ? "bg-muted text-foreground" : ""
        )}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("orderedList") ? "bg-muted text-foreground" : ""
        )}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </>,
    
    // Section 3: Alignment, quotes, and code
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "left" }) ? "bg-muted text-foreground" : ""
        )}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "center" }) ? "bg-muted text-foreground" : ""
        )}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("blockquote") ? "bg-muted text-foreground" : ""
        )}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("codeBlock") ? "bg-muted text-foreground" : ""
        )}
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </Button>
    </>,
  ] : null;

  // Mobile toolbar with sections and navigation
  if (isMobile && toolbarSections) {
    return (
      <div className="sticky top-0 z-10 flex flex-col rounded-t-md border-b bg-background rich-text-toolbar">
        <div className="flex items-center justify-between px-1 py-1 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setToolbarSection((prev) => Math.max(0, prev - 1))}
            disabled={toolbarSection === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-xs text-muted-foreground">
            {toolbarSection === 0 ? "Basic" : toolbarSection === 1 ? "Structure" : "Formatting"}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setToolbarSection((prev) => Math.min(toolbarSections.length - 1, prev + 1))}
            disabled={toolbarSection === toolbarSections.length - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-1 p-1">
          {toolbarSections[toolbarSection]}
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            className="h-8 w-8 p-0"
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            className="h-8 w-8 p-0"
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Desktop toolbar (unchanged)
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-md border-b bg-background p-1 px-3 rich-text-toolbar">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bold") ? "bg-muted text-foreground" : ""
        )}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("italic") ? "bg-muted text-foreground" : ""
        )}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("underline") ? "bg-muted text-foreground" : ""
        )}
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("strike") ? "bg-muted text-foreground" : ""
        )}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("highlight") ? "bg-muted text-foreground" : ""
        )}
        title="Highlight"
      >
        <Highlighter className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("heading", { level: 1 }) ? "bg-muted text-foreground" : ""
        )}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("heading", { level: 2 }) ? "bg-muted text-foreground" : ""
        )}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bulletList") ? "bg-muted text-foreground" : ""
        )}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("orderedList") ? "bg-muted text-foreground" : ""
        )}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "left" }) ? "bg-muted text-foreground" : ""
        )}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "center" }) ? "bg-muted text-foreground" : ""
        )}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "right" }) ? "bg-muted text-foreground" : ""
        )}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("blockquote") ? "bg-muted text-foreground" : ""
        )}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("codeBlock") ? "bg-muted text-foreground" : ""
        )}
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        className="h-8 w-8 p-0"
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        className="h-8 w-8 p-0"
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};
