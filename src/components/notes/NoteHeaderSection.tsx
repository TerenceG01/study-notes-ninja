import { Maximize2, Minimize2, Clock, X } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Note } from "@/hooks/useNotes";
interface NoteHeaderSectionProps {
  editingNote: Note | null;
  isFullscreen: boolean;
  commonSubjects: string[];
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  onNoteChange: (note: Note | null) => void;
  onToggleFullscreen: () => void;
  onToggleAutoSave: () => void;
}
export const NoteHeaderSection = ({
  editingNote,
  isFullscreen,
  commonSubjects,
  lastSaved,
  autoSaveEnabled,
  onNoteChange,
  onToggleFullscreen,
  onToggleAutoSave
}: NoteHeaderSectionProps) => {
  return <>
      <div className="flex justify-between items-center">
        <DialogHeader className="flex-grow">
          <DialogTitle>
            <Input value={editingNote?.title || ""} onChange={e => onNoteChange(editingNote ? {
            ...editingNote,
            title: e.target.value
          } : null)} placeholder="Note Title" className="text-xl font-semibold my-[10px] mx-[5px]" />
          </DialogTitle>
        </DialogHeader>
        
        <Button variant="ghost" size="icon" onClick={onToggleFullscreen} className="ml-2">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2">
          <Select value={editingNote?.subject || "General"} onValueChange={value => onNoteChange(editingNote ? {
          ...editingNote,
          subject: value
        } : null)}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {commonSubjects.map(subject => <SelectItem key={subject} value={subject} className="hover:bg-muted cursor-pointer">
                  {subject}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" className="text-xs flex-shrink-0" onClick={onToggleAutoSave}>
            {autoSaveEnabled ? <>
                <Clock className="mr-1 h-3 w-3" />
                Auto-save On
              </> : <>
                <X className="mr-1 h-3 w-3" />
                Auto-save Off
              </>}
          </Button>
          
          {lastSaved && <span className="text-xs text-muted-foreground whitespace-nowrap">
              Saved {lastSaved.toLocaleTimeString()}
            </span>}
        </div>
      </div>
    </>;
};