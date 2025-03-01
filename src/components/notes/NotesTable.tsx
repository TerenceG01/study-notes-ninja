
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Note, StudyGroup } from "./types";
import { NoteTableRow } from "./table/NoteTableRow";
import { ShareNoteDialog } from "./table/ShareNoteDialog";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sharingSubject, setSharingSubject] = useState<string | null>(null);
  const [updatingNoteId, setUpdatingNoteId] = useState<string | null>(null);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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

  const handleShareNote = (note: Note) => {
    setSelectedNote(note);
    setShowGroupSelector(true);
  };

  const handleShareToGroup = async (groupId: string) => {
    if (!selectedNote) return;
    
    setShowGroupSelector(false);
    setSelectedGroupId(groupId);
    setIsConfirmDialogOpen(true);
  };

  const confirmShareToGroup = async () => {
    if (!selectedNote || !selectedGroupId) return;
    
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
    setSharingSubject(selectedNote.subject || null);
    
    // Show loading toast
    const loadingToastId = toast({
      title: "Sharing note to study group",
      description: "Please wait...",
    }).id;
    
    try {
      if (!user) throw new Error("User not found");

      // Get the count of existing notes in the group
      const { data: existingNotes, error: existingNotesError } = await supabase
        .from('study_group_notes')
        .select('id')
        .eq('group_id', selectedGroupId);

      if (existingNotesError) throw existingNotesError;

      const startOrder = (existingNotes?.length || 0) + 1;
      
      // Log the note being shared for debugging
      console.log("Sharing note:", selectedNote.id, "to group:", selectedGroupId);
      
      const { data, error } = await supabase
        .from('study_group_notes')
        .insert({
          note_id: selectedNote.id,
          group_id: selectedGroupId,
          shared_by: user.id,
          display_order: startOrder
        })
        .select();
        
      if (error) {
        console.error("Error sharing note:", error);
        throw error;
      }
      
      console.log("Note shared successfully:", data);

      toast({
        title: "Success",
        description: `Shared "${selectedNote.title}" to study group`,
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
              <p>Shared "{selectedNote.title}" to {selectedGroup.name}</p>
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
      
      console.error("Error sharing note:", error);
      toast({
        variant: "destructive",
        title: "Error sharing note",
        description: error instanceof Error 
          ? error.message 
          : "Failed to share note. Please try again.",
      });
    } finally {
      setSharingSubject(null);
      setSelectedGroupId(null);
      setSelectedNote(null);
    }
  };

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
            <TableRow>
              <TableHead className="font-semibold text-primary w-[20%]">Subject</TableHead>
              <TableHead className="w-[20%]">Title</TableHead>
              <TableHead className="hidden md:table-cell w-[30%]">Content</TableHead>
              <TableHead className="hidden sm:table-cell w-[10%]">Created At</TableHead>
              <TableHead className="w-[20%]">Actions</TableHead>
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
                <NoteTableRow
                  key={note.id}
                  note={note}
                  generatingFlashcardsForNote={generatingFlashcardsForNote}
                  updatingNoteId={updatingNoteId}
                  sharingSubject={sharingSubject}
                  onNoteClick={onNoteClick}
                  onGenerateFlashcards={onGenerateFlashcards}
                  onShareNote={handleShareNote}
                  onNotesChanged={onNotesChanged}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ShareNoteDialog
        selectedNote={selectedNote}
        showGroupSelector={showGroupSelector}
        isConfirmDialogOpen={isConfirmDialogOpen}
        selectedGroupId={selectedGroupId}
        isLoadingGroups={isLoadingGroups}
        studyGroups={studyGroups}
        sharingSubject={sharingSubject}
        setShowGroupSelector={setShowGroupSelector}
        setIsConfirmDialogOpen={setIsConfirmDialogOpen}
        handleShareToGroup={handleShareToGroup}
        confirmShareToGroup={confirmShareToGroup}
      />
    </>
  );
};
