
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Note } from "../types";
import { Maximize2, Minimize2, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AutoSaveControl } from "./AutoSaveControl";

interface DesktopCreateHeaderProps {
  newNote: Note;
  isFullscreen: boolean;
  commonSubjects: string[];
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  onNoteChange: (field: string, value: string | string[]) => void;
  onToggleAutoSave: () => void;
  onToggleLectureMode: () => void;
  onToggleFullscreen?: () => void;
}

export const DesktopCreateHeader = ({
  newNote,
  isFullscreen,
  commonSubjects,
  lastSaved,
  autoSaveEnabled,
  onNoteChange,
  onToggleAutoSave,
  onToggleLectureMode,
  onToggleFullscreen
}: DesktopCreateHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <DialogHeader className="flex-grow space-y-0 p-0 max-w-[calc(100%-100px)]">
          <DialogTitle className="text-base">
            <Input 
              value={newNote.title} 
              onChange={e => onNoteChange('title', e.target.value)} 
              placeholder="Note Title" 
              className="text-base font-semibold border-none shadow-none focus-visible:ring-1 bg-background h-8 px-2 w-full"
            />
          </DialogTitle>
        </DialogHeader>
        
        {onToggleFullscreen && (
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
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <div className="md:col-span-2">
          <Select 
            value={newNote.subject || "General"} 
            onValueChange={value => onNoteChange('subject', value)}
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
          <AutoSaveControl 
            autoSaveEnabled={autoSaveEnabled} 
            onToggleAutoSave={onToggleAutoSave} 
            lastSaved={lastSaved}
          />
        </div>
      </div>
    </>
  );
};
