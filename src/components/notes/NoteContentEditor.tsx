
import { FileText, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Note } from "@/hooks/useNotes";
interface NoteContentEditorProps {
  editingNote: Note | null;
  showSummary: boolean;
  isFullscreen: boolean;
  wordCount: number;
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  onNoteChange: (note: Note | null) => void;
  onToggleAutoSave: () => void;
}
export const NoteContentEditor = ({
  editingNote,
  showSummary,
  isFullscreen,
  wordCount,
  autoSaveEnabled,
  lastSaved,
  onNoteChange,
  onToggleAutoSave
}: NoteContentEditorProps) => {
  return <div className="mt-4 min-h-[300px] flex flex-col h-full">
      {showSummary && editingNote?.summary ? <Card className="p-4 bg-muted/50 h-full overflow-auto">
          <div className="prose max-w-none">
            {editingNote.summary.split('\n').map((line, index) => <p key={index} className="mb-2">{line}</p>)}
          </div>
        </Card> : <div className="flex flex-col h-full flex-1">
          <Textarea value={editingNote?.content || ""} onChange={e => onNoteChange(editingNote ? {
        ...editingNote,
        content: e.target.value
      } : null)} placeholder="Write your notes here..." style={{
        height: isFullscreen ? "calc(100vh - 350px)" : "calc(100vh - 450px)",
        minHeight: "300px"
      }} className="flex-grow resize-none mx-[5px] flex-1" />
          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{wordCount} words</span>
            </div>
            <div>
              Press Ctrl+S to save
            </div>
          </div>
        </div>}
    </div>;
};
