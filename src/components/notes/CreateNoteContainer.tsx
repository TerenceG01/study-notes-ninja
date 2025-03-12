
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { NoteContentEditor } from "./NoteContentEditor";
import { CreateNoteHeader } from "./CreateNoteHeader";

interface CreateNoteContainerProps {
  newNote: {
    title: string;
    content: string;
    subject: string;
  };
  isFullscreen: boolean;
  wordCount: number;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  commonSubjects: string[];
  onNoteChange: (field: string, value: string | string[]) => void;
  onNoteContentChange: (content: string) => void;
  onToggleAutoSave: () => void;
  onToggleLectureMode: () => void;
}

export const CreateNoteContainer = ({
  newNote,
  isFullscreen,
  wordCount,
  lastSaved,
  autoSaveEnabled,
  commonSubjects,
  onNoteChange,
  onNoteContentChange,
  onToggleAutoSave,
  onToggleLectureMode
}: CreateNoteContainerProps) => {
  const isMobile = useIsMobile();
  
  const handleContentChange = (html: string) => {
    onNoteContentChange(html);
  };
  
  // Create a complete Note object with all required properties
  const noteWithRequiredProps = {
    id: '',
    title: newNote.title,
    content: newNote.content,
    subject: newNote.subject,
    created_at: new Date().toISOString(),
    folder: 'My Notes'
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <CreateNoteHeader 
        newNote={noteWithRequiredProps}
        isFullscreen={isFullscreen}
        commonSubjects={commonSubjects}
        lastSaved={lastSaved}
        autoSaveEnabled={autoSaveEnabled}
        onNoteChange={onNoteChange}
        onToggleAutoSave={onToggleAutoSave}
        onToggleLectureMode={onToggleLectureMode}
      />

      <ScrollArea className="flex-grow overflow-y-auto overflow-x-hidden">
        <div className={`space-y-2 ${isMobile ? 'pr-1' : 'pr-2 sm:pr-4'} max-w-full`}>
          <NoteContentEditor 
            editingNote={noteWithRequiredProps}
            showSummary={false}
            isFullscreen={isFullscreen}
            wordCount={wordCount}
            autoSaveEnabled={autoSaveEnabled}
            lastSaved={lastSaved}
            onNoteChange={(note) => {
              if (note) {
                onNoteChange('title', note.title || '');
                onNoteContentChange(note.content || '');
                onNoteChange('subject', note.subject || 'General');
              }
            }}
            onToggleAutoSave={onToggleAutoSave}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
