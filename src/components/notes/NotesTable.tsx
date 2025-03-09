
import { Table, TableBody } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Note, StudyGroup } from "./types";
import { NoteTableRow } from "./table/NoteTableRow";
import { ShareNoteDialog } from "./table/ShareNoteDialog";
import { NotesTableHeader } from "./table/NotesTableHeader";
import { EmptyNotesRow } from "./table/EmptyNotesRow";
import { useShareNoteHandler } from "./table/ShareNoteHandler";
import { supabase } from "@/integrations/supabase/client";

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
  const { user } = useAuth();

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

  // Use the extracted share note handling logic
  const shareNoteHandlers = useShareNoteHandler({
    studyGroups,
    onNotesChanged
  });

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <Table className="w-full table-fixed h-full">
          <NotesTableHeader />
          <TableBody className="overflow-y-auto">
            {notes.length === 0 ? (
              <EmptyNotesRow />
            ) : (
              notes.map((note) => (
                <NoteTableRow
                  key={note.id}
                  note={note}
                  generatingFlashcardsForNote={generatingFlashcardsForNote}
                  updatingNoteId={shareNoteHandlers.updatingNoteId}
                  sharingSubject={shareNoteHandlers.sharingSubject}
                  onNoteClick={onNoteClick}
                  onGenerateFlashcards={onGenerateFlashcards}
                  onShareNote={shareNoteHandlers.handleShareNote}
                  onNotesChanged={onNotesChanged}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ShareNoteDialog
        selectedNote={shareNoteHandlers.selectedNote}
        showGroupSelector={shareNoteHandlers.showGroupSelector}
        isConfirmDialogOpen={shareNoteHandlers.isConfirmDialogOpen}
        selectedGroupId={shareNoteHandlers.selectedGroupId}
        isLoadingGroups={isLoadingGroups}
        studyGroups={studyGroups}
        sharingSubject={shareNoteHandlers.sharingSubject}
        setShowGroupSelector={shareNoteHandlers.setShowGroupSelector}
        setIsConfirmDialogOpen={shareNoteHandlers.setIsConfirmDialogOpen}
        handleShareToGroup={shareNoteHandlers.handleShareToGroup}
        confirmShareToGroup={shareNoteHandlers.confirmShareToGroup}
      />
    </>
  );
};
