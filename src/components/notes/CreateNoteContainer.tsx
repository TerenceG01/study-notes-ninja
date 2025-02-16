
import { useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NoteEditor } from "./NoteEditor";

interface CreateNoteContainerProps {
  isExpanded: boolean;
  note: {
    title: string;
    content: string;
    tags: string[];
    subject: string;
  };
  newTag: string;
  commonSubjects: string[];
  onNoteChange: (field: string, value: string | string[]) => void;
  onTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const CreateNoteContainer = ({
  isExpanded,
  note,
  newTag,
  commonSubjects,
  onNoteChange,
  onTagChange,
  onAddTag,
  onRemoveTag,
  onCancel,
  onSave,
}: CreateNoteContainerProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  if (!isExpanded) return null;

  return (
    <Card className="mb-6 border-primary/20 animate-fade-in max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="text-lg font-medium">Create New Note</CardTitle>
        <CardDescription>Add a new note to your collection</CardDescription>
      </CardHeader>
      <CardContent className="p-6" ref={editorRef}>
        <NoteEditor
          note={note}
          newTag={newTag}
          commonSubjects={commonSubjects}
          onNoteChange={onNoteChange}
          onTagChange={onTagChange}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          onCancel={onCancel}
          onSave={onSave}
        />
      </CardContent>
    </Card>
  );
};
