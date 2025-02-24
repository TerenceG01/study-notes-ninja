
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CreateStudyGroupForm } from "../study-groups/CreateStudyGroupForm";
import { useNavigate } from "react-router-dom";

interface ShareSubjectDialogProps {
  subject: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareSubjectDialog({ subject, open, onOpenChange }: ShareSubjectDialogProps) {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: studyGroups, isLoading } = useQuery({
    queryKey: ['user-study-groups'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .rpc('get_user_study_groups', {
          p_user_id: user.id
        });

      if (error) throw error;
      return data;
    },
  });

  const handleShareToGroup = async (groupId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not found");

      // Get all notes with this subject
      const { data: notes } = await supabase
        .from('notes')
        .select('id')
        .eq('subject', subject);

      if (!notes?.length) {
        throw new Error("No notes found for this subject");
      }

      // Get the count of existing notes in the group
      const { data: existingNotes } = await supabase
        .from('study_group_notes')
        .select('id')
        .eq('group_id', groupId);

      const startOrder = (existingNotes?.length || 0) + 1;

      // Share all notes with sequential display_order
      for (let i = 0; i < notes.length; i++) {
        const { error } = await supabase
          .from('study_group_notes')
          .insert({
            note_id: notes[i].id,
            group_id: groupId,
            shared_by: user.id,
            display_order: startOrder + i
          });
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Shared ${notes.length} notes with the study group`,
      });

      onOpenChange(false);
      navigate(`/study-groups/${groupId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error sharing notes",
        description: error.message,
      });
    }
  };

  const handleCreateAndShare = async (groupData: { name: string, description: string }) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not found");

      // Create new study group
      const { data: newGroup, error: groupError } = await supabase
        .rpc('create_study_group', {
          p_name: groupData.name,
          p_subject: subject,
          p_description: groupData.description,
          p_user_id: user.id
        });

      if (groupError) throw groupError;

      // Share the notes to the new group
      await handleShareToGroup(newGroup.id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating study group",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Subject: {subject}</DialogTitle>
        </DialogHeader>

        {isCreatingGroup ? (
          <div className="py-4">
            <CreateStudyGroupForm
              onSubmit={handleCreateAndShare}
              onCancel={() => setIsCreatingGroup(false)}
              initialSubject={subject}
            />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsCreatingGroup(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Study Group
            </Button>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Your Study Groups</h4>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : studyGroups?.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You're not a member of any study groups yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {studyGroups?.map((group) => (
                    <Button
                      key={group.id}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => handleShareToGroup(group.id)}
                    >
                      <span className="truncate">{group.name}</span>
                      <Share2 className="ml-2 h-4 w-4" />
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
