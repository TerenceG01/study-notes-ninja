
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Share } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Note, StudyGroup } from "../types";
import { useNavigate } from "react-router-dom";

interface ShareNoteDialogProps {
  selectedNote: Note | null;
  showGroupSelector: boolean;
  isConfirmDialogOpen: boolean;
  selectedGroupId: string | null;
  isLoadingGroups: boolean;
  studyGroups: StudyGroup[] | undefined;
  sharingSubject: string | null;
  setShowGroupSelector: (show: boolean) => void;
  setIsConfirmDialogOpen: (show: boolean) => void;
  handleShareToGroup: (groupId: string) => void;
  confirmShareToGroup: () => void;
}

export const ShareNoteDialog: React.FC<ShareNoteDialogProps> = ({
  selectedNote,
  showGroupSelector,
  isConfirmDialogOpen,
  selectedGroupId,
  isLoadingGroups,
  studyGroups,
  sharingSubject,
  setShowGroupSelector,
  setIsConfirmDialogOpen,
  handleShareToGroup,
  confirmShareToGroup,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Study Group Selection Sheet */}
      <Sheet open={showGroupSelector} onOpenChange={setShowGroupSelector}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Select Study Group</SheetTitle>
            <SheetDescription>
              Choose a study group to share {selectedNote?.title ? `"${selectedNote.title}"` : 'note'} with
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
            <AlertDialogTitle>Share Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to share "{selectedNote?.title}" to the selected study group?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmShareToGroup}>Share Note</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
