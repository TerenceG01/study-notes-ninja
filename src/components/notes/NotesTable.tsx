import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, MoreVertical, Share, Trash2, GripHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useNotes } from "@/hooks/useNotes";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  folder: string;
  summary?: string;
  tags?: string[];
  subject?: string;
  subject_color?: string;
}

interface NotesTableProps {
  notes: Note[];
  loading: boolean;
  generatingFlashcardsForNote: string | null;
  onNoteClick: (note: Note) => void;
  onGenerateFlashcards: (note: Note) => void;
  onNotesChanged: () => void;
}

export const NotesTable = ({
  notes,
  loading,
  generatingFlashcardsForNote,
  onNoteClick,
  onGenerateFlashcards,
  onNotesChanged,
}: NotesTableProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { deleteNotesForSubject } = useNotes();
  
  // Default column sizes (total should be 100)
  const [columnSizes, setColumnSizes] = useState({
    subject: 20,
    title: 25,
    content: 30,
    date: 15,
    actions: 10,
  });

  const handleColorChange = async (e: React.MouseEvent, note: Note, color: string) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          subject_color: color,
        })
        .eq('id', note.id);

      if (error) throw error;

      onNotesChanged();
      
      toast({
        title: "Success",
        description: `Updated color for ${note.subject || 'note'}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update note color",
      });
    }
  };

  const handleShareSubject = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    if (!note.subject) return;
    
    try {
      const notesWithSubject = notes.filter(n => n.subject === note.subject);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not found");

      const { data: group, error: groupError } = await supabase
        .rpc('create_study_group', {
          p_name: `${note.subject} Study Group`,
          p_subject: note.subject,
          p_description: `Study group for ${note.subject}`,
          p_user_id: user.id
        });

      if (groupError) throw groupError;

      for (const n of notesWithSubject) {
        await supabase
          .from('study_group_notes')
          .insert({
            note_id: n.id,
            group_id: group.id,
            shared_by: user.id
          });
      }

      toast({
        title: "Success",
        description: `Created study group for ${note.subject} and shared ${notesWithSubject.length} notes`,
      });

      navigate(`/study-groups/${group.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share subject",
      });
    }
  };

  const handleRemoveSubject = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    if (!note.subject) return;

    if (note.subject === 'General') {
      try {
        await deleteNotesForSubject('General');
        onNotesChanged();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete General notes",
        });
      }
    } else {
      try {
        const { error } = await supabase
          .from('notes')
          .update({ subject: null })
          .eq('subject', note.subject);
  
        if (error) throw error;
  
        if (searchParams.get("subject") === note.subject) {
          searchParams.delete("subject");
          setSearchParams(searchParams);
        }
  
        onNotesChanged();
        
        toast({
          title: "Success",
          description: `Removed subject ${note.subject}`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove subject",
        });
      }
    }
  };

  const SUBJECT_COLORS = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { name: 'Green', value: 'green', class: 'bg-green-50 text-green-600 hover:bg-green-100' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
    { name: 'Red', value: 'red', class: 'bg-red-50 text-red-600 hover:bg-red-100' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
  ];

  return (
    <ResizablePanelGroup direction="horizontal" className="w-full">
      <ResizablePanel defaultSize={columnSizes.subject}>
        <TableHead className="font-semibold text-primary">Subject</TableHead>
        {!loading && notes.map((note) => (
          <TableCell key={note.id} className="flex items-center gap-2">
            <div
              onClick={() => onNoteClick(note)}
              className={cn(
                "flex-1 px-3 py-1 rounded-md font-medium transition-colors",
                note.subject_color ? 
                  SUBJECT_COLORS.find(c => c.value === note.subject_color)?.class : 
                  "bg-primary/5 text-primary hover:bg-primary/10"
              )}
            >
              {note.subject || 'General'}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                side="top" 
                sideOffset={5}
                className="w-48"
              >
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Subject Color
                </div>
                <div className="grid grid-cols-5 gap-1 p-2">
                  {SUBJECT_COLORS.map((color) => (
                    <Button
                      key={color.value}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-6 w-6 p-0 rounded-full",
                        color.class
                      )}
                      onClick={(e) => handleColorChange(e, note, color.value)}
                    />
                  ))}
                </div>
                <DropdownMenuSeparator />
                {note.subject && (
                  <>
                    <DropdownMenuItem 
                      onClick={(e) => handleShareSubject(e, note)}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share Subject
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => handleRemoveSubject(e, note)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Subject
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        ))}
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={columnSizes.title}>
        <TableHead>Title</TableHead>
        {!loading && notes.map((note) => (
          <TableCell 
            key={note.id}
            className="font-medium"
            onClick={() => onNoteClick(note)}
          >
            {note.title}
          </TableCell>
        ))}
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={columnSizes.content}>
        <TableHead className="hidden md:table-cell">Content</TableHead>
        {!loading && notes.map((note) => (
          <TableCell 
            key={note.id}
            className="max-w-md truncate hidden md:table-cell"
            onClick={() => onNoteClick(note)}
          >
            {note.content}
          </TableCell>
        ))}
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={columnSizes.date}>
        <TableHead className="hidden sm:table-cell">Created At</TableHead>
        {!loading && notes.map((note) => (
          <TableCell 
            key={note.id}
            className="hidden sm:table-cell"
            onClick={() => onNoteClick(note)}
          >
            {new Date(note.created_at).toLocaleDateString()}
          </TableCell>
        ))}
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={columnSizes.actions}>
        <TableHead>Actions</TableHead>
        {!loading && notes.map((note) => (
          <TableCell key={note.id}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onGenerateFlashcards(note);
              }}
              disabled={!!generatingFlashcardsForNote}
              className="flex items-center gap-2"
            >
              {generatingFlashcardsForNote === note.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  Create Flashcards
                </>
              )}
            </Button>
          </TableCell>
        ))}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
