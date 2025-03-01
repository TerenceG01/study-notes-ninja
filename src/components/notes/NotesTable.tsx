
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Loader2, Share } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Note } from "@/hooks/useNotes";

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
  const { user } = useAuth();
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [sharingSubject, setSharingSubject] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [studyGroups, setStudyGroups] = useState<any[]>([]);

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
    
    // Show loading toast
    const loadingToastId = toast({
      title: "Sharing notes to study group",
      description: "Please wait...",
    }).id;
    
    try {
      // Determine if we're sharing just this note or all notes with this subject
      const notesToShare = selectedNote.subject && sharingSubject === selectedNote.subject
        ? notes.filter(n => n.subject === selectedNote.subject)
        : [selectedNote];
      
      if (!user) throw new Error("User not found");

      // Get the count of existing notes in the group
      const { data: existingNotes, error: existingNotesError } = await supabase
        .from('study_group_notes')
        .select('id')
        .eq('group_id', selectedGroupId);

      if (existingNotesError) throw existingNotesError;

      const startOrder = (existingNotes?.length || 0) + 1;
      let sharedCount = 0;

      // Share all selected notes with sequential display_order
      for (let i = 0; i < notesToShare.length; i++) {
        const n = notesToShare[i];
        // Log the note being shared for debugging
        console.log("Sharing note:", n.id, "to group:", selectedGroupId);
        
        const { data, error } = await supabase
          .from('study_group_notes')
          .insert({
            note_id: n.id,
            group_id: selectedGroupId,
            shared_by: user.id,
            display_order: startOrder + i
          })
          .select();
          
        if (error) {
          console.error("Error sharing note:", error);
          continue;
        }
        
        console.log("Note shared successfully:", data);
        sharedCount++;
      }

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      toast({
        title: "Success",
        description: `Shared ${sharedCount} note${sharedCount !== 1 ? 's' : ''} to study group`,
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
              <p>Shared {sharedCount} note{sharedCount !== 1 ? 's' : ''} to {selectedGroup.name}</p>
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
      
      console.error("Error sharing:", error);
      toast({
        variant: "destructive",
        title: "Error sharing",
        description: error instanceof Error 
          ? error.message 
          : "Failed to share. Please try again.",
      });
    } finally {
      setSharingSubject(null);
      setSelectedGroupId(null);
      setSelectedNote(null);
    }
  };

  // Fetch study groups when component mounts
  useState(() => {
    const fetchStudyGroups = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('study_groups')
          .select(`
            id,
            name,
            study_group_members!inner(user_id)
          `)
          .eq('study_group_members.user_id', user.id);
          
        if (error) throw error;
        setStudyGroups(data || []);
      } catch (error) {
        console.error("Error fetching study groups:", error);
      }
    };
    
    fetchStudyGroups();
  }, [user]);

  // Render table component
  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Title</th>
            <th className="text-left py-3 px-4 font-medium">Subject</th>
            <th className="text-left py-3 px-4 font-medium">Created</th>
            <th className="text-right py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-muted-foreground">
                No notes found. Create your first note to get started!
              </td>
            </tr>
          ) : (
            notes.map((note) => (
              <tr key={note.id} className="border-b hover:bg-muted/50 cursor-pointer">
                <td 
                  className="py-3 px-4" 
                  onClick={() => onNoteClick(note)}
                >
                  {note.title}
                </td>
                <td 
                  className="py-3 px-4" 
                  onClick={() => onNoteClick(note)}
                >
                  {note.subject || "-"}
                </td>
                <td 
                  className="py-3 px-4" 
                  onClick={() => onNoteClick(note)}
                >
                  {new Date(note.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  {generatingFlashcardsForNote === note.id ? (
                    <Button variant="ghost" size="sm" disabled>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Generating...
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onGenerateFlashcards(note)}
                      >
                        Flashcards
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedNote(note);
                          // Show dialog with options
                          setIsConfirmDialogOpen(true);
                        }}
                      >
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Alert Dialog for share confirmation */}
      <AlertDialog 
        open={isConfirmDialogOpen} 
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share Notes</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedNote?.subject 
                ? `Do you want to share just this note or all notes with the subject "${selectedNote.subject}"?`
                : "Share this note to a study group:"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mb-4">
            <select 
              className="w-full p-2 border rounded"
              value={selectedGroupId || ''}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              <option value="">Select a study group</option>
              {studyGroups?.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            
            {selectedNote?.subject && (
              <>
                <Button
                  onClick={() => {
                    // Share just this note
                    setSharingSubject(null);
                    confirmShareToGroup();
                  }}
                  disabled={!selectedGroupId}
                >
                  Share this note only
                </Button>
                
                <AlertDialogAction
                  onClick={() => {
                    // Share all notes with this subject
                    setSharingSubject(selectedNote.subject);
                    confirmShareToGroup();
                  }}
                  disabled={!selectedGroupId}
                >
                  Share all "{selectedNote.subject}" notes
                </AlertDialogAction>
              </>
            )}
            
            {!selectedNote?.subject && (
              <AlertDialogAction
                onClick={confirmShareToGroup}
                disabled={!selectedGroupId}
              >
                Share Note
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
