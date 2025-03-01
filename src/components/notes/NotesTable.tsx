
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MoreVertical, Edit, Trash, Copy, Clock, Share } from "lucide-react";
import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShareNote } from "@/components/study-groups/ShareNote";

export const NotesTable = ({ 
  notes, 
  onDelete, 
  onEdit, 
  onGenerateFlashcards, 
  generatingFlashcardsForNote = null 
}) => {
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedStudyGroup, setSelectedStudyGroup] = useState(null);
  const [shareSubjectDialogOpen, setShareSubjectDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch study groups
  const { data: studyGroups, isLoading: loadingGroups } = useQuery({
    queryKey: ['user-study-groups'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_study_groups');
      if (error) throw error;
      return data;
    },
  });

  if (!notes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No notes found</h3>
        <p className="text-muted-foreground mb-4">
          Create your first note to get started.
        </p>
      </div>
    );
  }

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setConfirmationDialogOpen(true);
  };

  const handleShareSubject = (note) => {
    setSelectedNote(note);
    setShareSubjectDialogOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      onDelete(noteToDelete.id);
      setNoteToDelete(null);
      setConfirmationDialogOpen(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-2 font-medium">Title</th>
            <th className="p-2 font-medium hidden md:table-cell">Subject</th>
            <th className="p-2 font-medium hidden md:table-cell">Created</th>
            <th className="p-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id} className="border-b hover:bg-muted/30 text-sm">
              <td className="p-2 max-w-[200px] truncate font-medium">{note.title}</td>
              <td className="p-2 hidden md:table-cell">
                {note.subject && (
                  <Badge variant="outline" className="capitalize">
                    {note.subject}
                  </Badge>
                )}
              </td>
              <td className="p-2 hidden md:table-cell text-muted-foreground">
                {format(new Date(note.created_at), 'MMM d, yyyy')}
              </td>
              <td className="p-2 text-right">
                <div className="flex justify-end items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(note)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onGenerateFlashcards(note)}
                    disabled={generatingFlashcardsForNote === note.id}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className={`h-4 w-4 ${generatingFlashcardsForNote === note.id ? 'animate-pulse' : ''}`} />
                    <span className="sr-only">Generate Flashcards</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(note)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Note
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onGenerateFlashcards(note)}
                        disabled={generatingFlashcardsForNote === note.id}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Generate Flashcards
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleShareSubject(note)}>
                        <Share className="mr-2 h-4 w-4" />
                        Share Note
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(note)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmationDialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
      />

      {/* Share Subject Dialog */}
      <Dialog open={shareSubjectDialogOpen} onOpenChange={setShareSubjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Note</DialogTitle>
            <DialogDescription>
              Select a study group to share this note with.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {loadingGroups ? (
              <div className="text-center py-4">Loading study groups...</div>
            ) : !studyGroups?.length ? (
              <div className="text-center py-4">
                You don't have any study groups yet. Create a study group first.
              </div>
            ) : (
              <div className="space-y-2">
                {studyGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setSelectedStudyGroup(group.id);
                      setShareSubjectDialogOpen(false);
                    }}
                  >
                    <div>
                      <h4 className="font-medium">{group.name}</h4>
                      <p className="text-sm text-muted-foreground">{group.subject}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ShareNote component */}
      {selectedStudyGroup && selectedNote && (
        <ShareNote 
          groupId={selectedStudyGroup} 
          selectedNoteId={selectedNote.id} 
          selectedSubject={selectedNote.subject} 
        />
      )}
    </div>
  );
};
