
import { FileText, Clock, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/notes";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resizeStartPosRef = useRef<number | null>(null);
  const { toast } = useToast();
  const [enhancing, setEnhancing] = useState(false);
  
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

  // Handle enhance note with AI
  const handleEnhanceNote = async (enhanceType: 'grammar' | 'structure' | 'all') => {
    if (!editingNote) return;
    
    try {
      setEnhancing(true);
      
      toast({
        title: "Enhancing note...",
        description: "This may take a few moments.",
      });

      const { data, error } = await supabase.functions.invoke('enhance-note', {
        body: {
          content: editingNote.content,
          title: editingNote.title,
          enhanceType
        },
      });

      if (error) throw error;

      if (data.enhancedContent) {
        onNoteChange({
          ...editingNote,
          content: data.enhancedContent
        });
        
        toast({
          title: "Note enhanced!",
          description: "Your note has been successfully enhanced.",
        });
      }
    } catch (error) {
      console.error("Error enhancing note:", error);
      toast({
        variant: "destructive",
        title: "Enhancement failed",
        description: "Failed to enhance your note. Please try again later.",
      });
    } finally {
      setEnhancing(false);
    }
  };

  return <div className="mt-4 min-h-[300px] flex flex-col h-full">
      {showSummary && editingNote?.summary ? (
        <Card className="p-4 bg-muted/50 h-full overflow-auto">
          <div className="prose max-w-none">
            {editingNote.summary.split('\n').map((line, index) => <p key={index} className="mb-2">{line}</p>)}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col h-full flex-1">
          <div className="relative flex-1">
            <div className="absolute right-2 top-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1 h-8"
                    disabled={enhancing || !editingNote?.content}
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    {enhancing ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEnhanceNote('grammar')}>
                    Fix Grammar & Spelling
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEnhanceNote('structure')}>
                    Improve Structure & Format
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEnhanceNote('all')}>
                    Complete Enhancement
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
              className="flex-grow resize-none mx-[5px] flex-1" 
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-muted/50 transition-colors"
              onMouseDown={handleResizeStart}
              title="Drag to resize"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{wordCount} words</span>
            </div>
            <div>
              Press Ctrl+S to save
            </div>
          </div>
        </div>
      )}
    </div>;
};
