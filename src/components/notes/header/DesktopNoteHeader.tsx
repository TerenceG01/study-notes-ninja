
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Note } from "@/hooks/useNotes";
import { Maximize2, Minimize2, BookOpen, Clock, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DesktopNoteHeaderProps {
  editingNote: Note | null;
  isFullscreen: boolean;
  commonSubjects: string[];
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  onNoteChange: (note: Note | null) => void;
  onToggleFullscreen: () => void;
  onToggleAutoSave: () => void;
  onToggleLectureMode: () => void;
}

export const DesktopNoteHeader = ({
  editingNote,
  isFullscreen,
  commonSubjects,
  lastSaved,
  autoSaveEnabled,
  onNoteChange,
  onToggleFullscreen,
  onToggleAutoSave,
  onToggleLectureMode
}: DesktopNoteHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <DialogHeader className="flex-grow space-y-0 p-0 max-w-[calc(100%-100px)]">
          <DialogTitle className="text-base">
            <Input 
              value={editingNote?.title || ""} 
              onChange={e => onNoteChange(editingNote ? {
                ...editingNote,
                title: e.target.value
              } : null)} 
              placeholder="Note Title" 
              className="text-base font-semibold border-none shadow-none focus-visible:ring-1 bg-background h-8 px-2 w-full"
            />
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-1 ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline"
                size="icon" 
                onClick={onToggleLectureMode}
                className="h-8 w-8"
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
            onClick={onToggleFullscreen} 
            className="hover:bg-muted h-8 w-8"
          >
            {isFullscreen ? 
              <Minimize2 className="h-4 w-4" /> : 
              <Maximize2 className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <div className="md:col-span-2">
          <Select 
            value={editingNote?.subject || "General"} 
            onValueChange={value => onNoteChange(editingNote ? {
              ...editingNote,
              subject: value
            } : null)}
          >
            <SelectTrigger className="w-full bg-background border-border h-8">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {commonSubjects.map(subject => (
                <SelectItem 
                  key={subject} 
                  value={subject} 
                  className="hover:bg-muted cursor-pointer"
                >
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <Button 
            variant={autoSaveEnabled ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs flex-shrink-0 h-8 transition-all"
            onClick={onToggleAutoSave}
          >
            {autoSaveEnabled ? (
              <>
                <Clock className="mr-1 h-3 w-3" />
                Auto-save On
              </>
            ) : (
              <>
                <X className="mr-1 h-3 w-3" />
                Auto-save Off
              </>
            )}
          </Button>
          
          {lastSaved && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
