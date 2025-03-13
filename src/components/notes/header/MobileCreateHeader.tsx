
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileEdit, BookOpen, Clock, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Note } from "../types";

interface MobileCreateHeaderProps {
  newNote: Note;
  autoSaveEnabled: boolean;
  onOpenTitleEditor: () => void;
  onToggleAutoSave: () => void;
  onToggleLectureMode: () => void;
  onDismiss: () => void;
}

export const MobileCreateHeader = ({
  newNote,
  autoSaveEnabled,
  onOpenTitleEditor,
  onToggleAutoSave,
  onToggleLectureMode,
  onDismiss
}: MobileCreateHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onDismiss}
        className="mr-1 h-8 w-8 hover:bg-muted"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 mx-1 truncate">
        <h3 className="text-sm font-medium truncate">
          {newNote.title || "New Note"}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
          {newNote.subject || "General"}
        </p>
      </div>
      
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleLectureMode}
              className="h-8 w-8 hover:bg-muted"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Lecture Mode</p>
          </TooltipContent>
        </Tooltip>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenTitleEditor}
          className="h-8 w-8 hover:bg-muted"
        >
          <FileEdit className="h-4 w-4" />
        </Button>
        
        <Button 
          variant={autoSaveEnabled ? "secondary" : "outline"} 
          size="sm" 
          className="text-xs h-8 ml-1 px-2"
          onClick={onToggleAutoSave}
        >
          {autoSaveEnabled ? (
            <Clock className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};
