
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, MoreVertical, ChevronUp, ChevronDown, Share, Trash2 } from "lucide-react";
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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

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

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  created_at: string;
}

interface NotesTableProps {
  notes: Note[];
  loading: boolean;
  generatingFlashcardsForNote: string | null;
  onNoteClick: (note: Note) => void;
  onGenerateFlashcards: (note: Note) => void;
  onNotesChanged: () => void;
}

const SUBJECT_COLORS = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { name: 'Green', value: 'green', class: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { name: 'Red', value: 'red', class: 'bg-red-50 text-red-600 hover:bg-red-100' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
];

export const NotesTable = ({
  notes,
  loading,
  generatingFlashcardsForNote,
  onNoteClick,
  onGenerateFlashcards,
  onNotesChanged,
}: NotesTableProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sharingSubject, setSharingSubject] = useState<string | null>(null);
  const [updatingNoteId, setUpdatingNoteId] = useState<string | null>(null);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Temporary local state for optimistic updates
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  
  // Function to update local notes state
  const updateLocalNotes = (updatedNotes: Note[]) => {
    setLocalNotes(updatedNotes);
  };

  // Fetch study groups
  const { data: studyGroups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['study-groups'],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const { data, error } = await supabase.rpc('get_user_study_groups', {
        p_user_id: user.id
      });
      if (error) throw error;
      return (data || []) as StudyGroup[];
    },
    enabled: !!user,
    retry: 1,
    staleTime: 1000 * 60 * 5
  });

  const handleColorChange = async (e: React.MouseEvent, note: Note, color: string) => {
    e.stopPropagation();
    
    if (!navigator.onLine) {
      toast({
        variant: "destructive",
        title: "You're offline",
        description: "Color changes will be applied when you're back online.",
      });
      return;
    }
    
    // Show optimistic UI update
    setUpdatingNoteId(note.id);
    
    try {
      // Optimistic update
      const updatedNotes = notes.map(n => 
        n.id === note.id ? { ...n, subject_color: color } : n
      );
      updateLocalNotes(updatedNotes);
      
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
      console.error("Error updating color:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to update note color. Please try again.",
      });
    } finally {
      setUpdatingNoteId(null);
    }
  };

  const handleShareSubject = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    if (!note.subject) return;
    
    setSelectedNote(note);
    setShowGroupSelector(true);
  };

  const handleShareToGroup = async (groupId: string) => {
    if (!selectedNote || !selectedNote.subject) return;
    
    setShowGroupSelector(false);
    setSelectedGroupId(groupId);
    setIsConfirmDialogOpen(true);
  };

  const confirmShareToGroup = async () => {
    if (!selectedNote || !selectedNote.subject || !selectedGroupId) return;
    
    if (!navigator.onLine) {
      toast({
        variant: "destructive",
        title: "You're offline",
        description: "Please connect to the internet to share notes.",
      });
      setIsConfirmDialogOpen(false);
      return;
    }
    
    // Show loading state
    setSharingSubject(selectedNote.subject);
    
    // Show loading toast
    const loadingToastId = toast({
      title: "Sharing notes to study group",
      description: "Please wait...",
    }).id;
    
    try {
      const notesWithSubject = notes.filter(n => n.subject === selectedNote.subject);
      
      if (!user) throw new Error("User not found");

      // Get the count of existing notes in the group
      const { data: existingNotes, error: existingNotesError } = await supabase
        .from('study_group_notes')
        .select('id')
        .eq('group_id', selectedGroupId);

      if (existingNotesError) throw existingNotesError;

      const startOrder = (existingNotes?.length || 0) + 1;
      let sharedCount = 0;

      // Share all notes with sequential display_order
      for (let i = 0; i < notesWithSubject.length; i++) {
        const n = notesWithSubject[i];
        const { error } = await supabase
          .from('study_group_notes')
          .insert({
            note_id: n.id,
            group_id: selectedGroupId,
            shared_by: user.id,
            display_order: startOrder + i
          });
          
        if (!error) sharedCount++;
      }

      toast({
        title: "Success",
        description: `Shared ${sharedCount} notes to study group`,
      });

      // Ask if user wants to navigate to the group
      setIsConfirmDialogOpen(false);
      
      // Find the selected group name
      const selectedGroup = studyGroups?.find(g => g.id === selectedGroupId);
      if (selectedGroup) {
        toast({
          title: "Success",
          description: (
            <div className="flex flex-col gap-2">
              <p>Shared {sharedCount} notes to {selectedGroup.name}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/study-groups/${selectedGroupId}`)}
              >
                View Study Group
              </Button>
            </div>
          ),
          duration: 5000,
        });
      }
    } catch (error) {
      // Dismiss loading toast if it's still showing
      toast.dismiss(loadingToastId);
      
      console.error("Error sharing subject:", error);
      toast({
        variant: "destructive",
        title: "Error sharing subject",
        description: error instanceof Error 
          ? error.message 
          : "Failed to share subject. Please try again.",
      });
    } finally {
      setSharingSubject(null);
      setSelectedGroupId(null);
      setSelectedNote(null);
    }
  };

  const handleRemoveSubject = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    if (!note.subject) return;
    
    if (!navigator.onLine) {
      toast({
        variant: "destructive",
        title: "You're offline",
        description: "Please connect to the internet to remove subjects.",
      });
      return;
    }
    
    // Show loading state
    setSharingSubject(note.subject);
    
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
      console.error("Error removing subject:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to remove subject. Please try again.",
      });
    } finally {
      setSharingSubject(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-primary">Subject</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Content</TableHead>
            <TableHead className="hidden sm:table-cell">Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <p className="text-muted-foreground">No notes found. Create your first note above!</p>
              </TableCell>
            </TableRow>
          ) : (
            notes.map((note) => (
              <TableRow 
                key={note.id}
                className="group hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onNoteClick(note)}
              >
                <TableCell className="flex items-center gap-2">
                  <div
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
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking dropdown
                        disabled={updatingNoteId === note.id || sharingSubject === note.subject}
                      >
                        {updatingNoteId === note.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
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
                            disabled={updatingNoteId === note.id}
                          />
                        ))}
                      </div>
                      <DropdownMenuSeparator />
                      {note.subject && (
                        <>
                          <DropdownMenuItem 
                            onClick={(e) => handleShareSubject(e, note)}
                            disabled={sharingSubject === note.subject}
                          >
                            {sharingSubject === note.subject ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sharing...
                              </>
                            ) : (
                              <>
                                <Share className="h-4 w-4 mr-2" />
                                Share Subject
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => handleRemoveSubject(e, note)}
                            disabled={sharingSubject === note.subject}
                          >
                            {sharingSubject === note.subject ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Removing...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Subject
                              </>
                            )}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium">
                  {note.title}
                </TableCell>
                <TableCell className="max-w-md truncate hidden md:table-cell">
                  {note.content}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(note.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Study Group Selection Sheet */}
      <Sheet open={showGroupSelector} onOpenChange={setShowGroupSelector}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Select Study Group</SheetTitle>
            <SheetDescription>
              Choose a study group to share {selectedNote?.subject} notes with
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            {isLoadingGroups ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : studyGroups && studyGroups.length > 0 ? (
              <div className="space-y-2">
                {studyGroups.map((group) => (
                  <div 
                    key={group.id} 
                    className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleShareToGroup(group.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Subject: {group.subject}
                        </p>
                      </div>
                      <Share className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You don't have any study groups yet</p>
                <Button onClick={() => navigate('/study-groups')}>
                  Create a Study Group
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share {selectedNote?.subject} Notes</AlertDialogTitle>
            <AlertDialogDescription>
              This will share all notes with the subject "{selectedNote?.subject}" to the selected study group.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmShareToGroup}>Share Notes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
