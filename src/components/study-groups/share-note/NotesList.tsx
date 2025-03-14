
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteCard } from "./NoteCard";
import { EmptyNotesList } from "./EmptyNotesList";
import { LoadingState } from "./LoadingState";
import type { Note } from "@/components/notes/types";

interface NotesListProps {
  notes: Note[] | undefined;
  sharedNotes: string[] | undefined;
  isLoading: boolean;
  isPending: boolean;
  onShareToggle: (noteId: string, isShared: boolean) => void;
  isMultiSelect?: boolean;
  selectedNotes?: string[];
  onSelectToggle?: (noteId: string, isSelected: boolean) => void;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  sharedNotes,
  isLoading,
  isPending,
  onShareToggle,
  isMultiSelect = false,
  selectedNotes = [],
  onSelectToggle
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {notes?.length ? (
          notes.map((note) => {
            const isShared = sharedNotes?.includes(note.id);
            const isSelected = selectedNotes.includes(note.id);
            return (
              <NoteCard
                key={note.id}
                note={note}
                isShared={!!isShared}
                isPending={isPending}
                onShareToggle={onShareToggle}
                isMultiSelect={isMultiSelect}
                isSelected={isSelected}
                onSelectToggle={onSelectToggle}
              />
            );
          })
        ) : (
          <EmptyNotesList />
        )}
      </div>
    </ScrollArea>
  );
};
