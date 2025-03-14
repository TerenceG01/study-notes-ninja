
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CommonSubjects } from "./CommonSubjects";
import { useState } from "react";
import { CreateNoteContainer } from "./CreateNoteContainer";
import { DialogFooterActions } from "./DialogFooterActions";
import { LectureMode } from "./LectureMode";
import { NoteCreationControls } from "./header/NoteCreationControls";
import { useNoteEditorState } from "@/hooks/useNoteEditorState";

interface NotesHeaderProps {
  onSearch: (query: string) => void;
}

export const NotesHeader = ({ onSearch }: NotesHeaderProps) => {
  const {
    newNote,
    isEditorExpanded,
    setIsEditorExpanded,
    handleNoteChange,
    handleNoteContentChange,
    wordCount,
    lastSaved,
    autoSaveEnabled,
    isSaved,
    isFullscreen,
    lectureMode,
    summarizing,
    summaryLevel,
    showSummary,
    enhancing,
    handleSave,
    toggleAutoSave,
    toggleLectureMode,
    toggleFullscreen,
    enableFullscreen,
    handleGenerateSummary,
    handleToggleSummary,
    setSummaryLevel,
    handleEnhanceNote,
  } = useNoteEditorState();

  const handleCreateNote = () => {
    setIsEditorExpanded(true);
    enableFullscreen(); // Always open in fullscreen
  };

  if (lectureMode && newNote) {
    const fullNote = {
      id: 'new-note-temp-id',
      title: newNote.title,
      content: newNote.content,
      subject: newNote.subject || 'General',
      created_at: new Date().toISOString(),
      folder: 'My Notes'
    };
    
    return (
      <LectureMode 
        note={fullNote} 
        onExit={toggleLectureMode}
      />
    );
  }

  return (
    <>
      <NoteCreationControls 
        onSearch={onSearch} 
        onCreateNote={handleCreateNote} 
      />

      <Sheet open={isEditorExpanded} onOpenChange={setIsEditorExpanded}>
        <SheetContent
          side="top"
          className="h-screen w-screen p-6 flex flex-col max-h-screen overflow-hidden bg-background"
        >
          <div className="flex flex-col h-full overflow-hidden">
            <CreateNoteContainer
              newNote={{
                id: '',
                title: newNote.title,
                content: newNote.content,
                subject: newNote.subject,
                created_at: new Date().toISOString(),
                folder: 'My Notes',
                summary: newNote.summary
              }}
              isFullscreen={isFullscreen}
              wordCount={wordCount}
              lastSaved={lastSaved}
              autoSaveEnabled={autoSaveEnabled}
              commonSubjects={CommonSubjects}
              summarizing={summarizing}
              summaryLevel={summaryLevel}
              enhancing={enhancing}
              showSummary={showSummary}
              onNoteChange={handleNoteChange}
              onNoteContentChange={handleNoteContentChange}
              onToggleAutoSave={toggleAutoSave}
              onToggleLectureMode={toggleLectureMode}
              onToggleFullscreen={toggleFullscreen}
              onSummaryLevelChange={setSummaryLevel}
              onGenerateSummary={handleGenerateSummary}
              onToggleSummary={handleToggleSummary}
              onEnhanceNote={handleEnhanceNote}
            />
            
            <DialogFooterActions
              onSave={handleSave}
              onCancel={() => setIsEditorExpanded(false)}
              isSaved={isSaved}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
