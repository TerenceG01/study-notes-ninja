
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Note, StudyGroup } from "../types";

interface ShareNoteHandlerProps {
  studyGroups: StudyGroup[] | undefined;
  onNotesChanged: () => void;
}

export const useShareNoteHandler = ({ studyGroups, onNotesChanged }: ShareNoteHandlerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sharingSubject, setSharingSubject] = useState<string | null>(null);
  const [updatingNoteId, setUpdatingNoteId] = useState<string | null>(null);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Clean up any pointer-event styling when dialog closes
  useEffect(() => {
    return () => {
      resetPointerEvents();
    };
  }, []);

  // Also reset pointer events when dialogs close
  useEffect(() => {
    if (!showGroupSelector && !isConfirmDialogOpen) {
      resetPointerEvents();
    }
  }, [showGroupSelector, isConfirmDialogOpen]);

  const resetPointerEvents = () => {
    // Reset pointer-events on body and html
    document.body.style.pointerEvents = '';
    document.documentElement.style.pointerEvents = '';
    
    // Reset all elements with pointer-events style
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      if (element instanceof HTMLElement && element.style.pointerEvents === 'none') {
        element.style.pointerEvents = '';
      }
    });
    
    // Force repaint to ensure changes take effect
    document.body.getBoundingClientRect();
  };

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
      resetPointerEvents();
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
      const user = (await supabase.auth.getUser()).data.user;
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
                onClick={() => {
                  resetPointerEvents();
                  navigate(`/study-groups/${selectedGroupId}`);
                }}
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
      resetPointerEvents();
    }
  };

  return {
    sharingSubject,
    updatingNoteId,
    showGroupSelector,
    selectedNote,
    isConfirmDialogOpen, 
    selectedGroupId,
    setShowGroupSelector,
    setIsConfirmDialogOpen,
    handleShareNote,
    handleShareToGroup,
    confirmShareToGroup
  };
};

import { Button } from "@/components/ui/button";
