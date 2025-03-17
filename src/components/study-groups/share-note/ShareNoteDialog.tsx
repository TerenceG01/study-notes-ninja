
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Filter, CheckCheck, X, Info, Search } from "lucide-react";
import { NotesList } from "./NotesList";
import { useShareNote } from "./useShareNote";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ShareNoteDialogProps {
  groupId: string;
}

export const ShareNoteDialog: React.FC<ShareNoteDialogProps> = ({ groupId }) => {
  const isMobile = useIsMobile();
  
  const {
    notes,
    sharedNotes,
    open,
    loadingNotes,
    loadingSharedNotes,
    isPending,
    handleShareToggle,
    handleShareMultiple,
    handleOpenChange,
    isDisabled
  } = useShareNote(groupId);

  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredNotes = notes?.filter(note => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    const title = (note.title || '').toLowerCase();
    const subject = (note.subject || '').toLowerCase();
    
    return title.includes(term) || subject.includes(term);
  });

  // Reset selections when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedNotes([]);
      setSearchTerm('');
    }
  }, [open]);

  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedNotes([]);
  };

  const handleSelectToggle = (noteId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedNotes(prev => [...prev, noteId]);
    } else {
      setSelectedNotes(prev => prev.filter(id => id !== noteId));
    }
  };

  const selectAll = () => {
    if (!filteredNotes) return;
    
    const unsharedNotes = filteredNotes
      .filter(note => !sharedNotes?.includes(note.id))
      .map(note => note.id);
    
    setSelectedNotes(unsharedNotes);
  };

  const clearSelection = () => {
    setSelectedNotes([]);
  };

  const shareSelected = () => {
    handleShareMultiple(selectedNotes);
    setSelectedNotes([]);
    setIsMultiSelectMode(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled} variant="outline" size={isMobile ? "sm" : "default"}>
          <Share2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
          {!isMobile && "Share Notes"}
        </Button>
      </DialogTrigger>
      <DialogContent className={isMobile ? "w-[95vw] p-4 max-w-[95vw]" : "sm:max-w-[600px]"}>
        <DialogHeader className={isMobile ? "mb-2 pb-0" : ""}>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share Notes with Group
          </DialogTitle>
          <DialogDescription className={isMobile ? "text-xs" : ""}>
            {isMultiSelectMode 
              ? "Select multiple notes to share with your group at once" 
              : "Toggle individual notes to share with your group"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-1">
          {/* Search and mode toggle */}
          <div className={`flex ${isMobile ? "flex-col gap-2" : "justify-between items-center"}`}>
            <div className={`relative ${isMobile ? "w-full" : "w-1/2"}`}>
              <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${isMobile ? "h-3 w-3" : "h-4 w-4"} text-muted-foreground`} />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isMobile ? "pl-7 py-1 h-8 text-sm" : "pl-8"}`}
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchTerm('')}
                >
                  <X className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                </Button>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={toggleMultiSelectMode}
              className={isMobile ? "text-xs py-1 h-8 w-full" : ""}
            >
              <Filter className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
              {isMultiSelectMode ? "Single Select Mode" : "Multi-Select Mode"}
            </Button>
          </div>
          
          {/* Multi-select controls */}
          {isMultiSelectMode && (
            <div className={`flex ${isMobile ? "flex-col gap-2" : "justify-between items-center"}`}>
              <div className={`flex gap-2 ${isMobile ? "w-full" : ""}`}>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  onClick={selectAll}
                  className={`${isMobile ? "text-xs py-1 h-8 flex-1" : ""}`}
                >
                  <CheckCheck className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  onClick={clearSelection}
                  className={`${isMobile ? "text-xs py-1 h-8 flex-1" : ""}`}
                >
                  <X className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
                  Clear
                </Button>
              </div>
              <div className={`${isMobile ? "flex justify-center w-full" : ""}`}>
                <Badge variant="outline" className={`${isMobile ? "text-xs" : ""}`}>
                  {selectedNotes.length} selected
                </Badge>
              </div>
            </div>
          )}

          {/* Notes list */}
          <div className="py-1">
            <NotesList
              notes={filteredNotes}
              sharedNotes={sharedNotes}
              isLoading={loadingNotes || loadingSharedNotes}
              isPending={isPending}
              onShareToggle={handleShareToggle}
              isMultiSelect={isMultiSelectMode}
              selectedNotes={selectedNotes}
              onSelectToggle={handleSelectToggle}
              isMobile={isMobile}
            />
          </div>
        </div>
        
        {/* Footer */}
        {isMultiSelectMode && (
          <DialogFooter className={`mt-4 ${isMobile ? "flex-col gap-2" : ""}`}>
            <div className={`flex w-full ${isMobile ? "flex-col gap-2" : "justify-between items-center"}`}>
              <div className={`flex items-center text-sm text-muted-foreground ${isMobile ? "justify-center mb-1" : ""}`}>
                <Info className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
                {selectedNotes.length === 0 
                  ? "Select notes to share" 
                  : `${selectedNotes.length} note${selectedNotes.length > 1 ? 's' : ''} selected`}
              </div>
              <Button 
                onClick={shareSelected}
                disabled={selectedNotes.length === 0 || isPending}
                className={isMobile ? "w-full" : ""}
              >
                <Share2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
                Share Selected
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
