
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
