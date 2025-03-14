
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Share2 } from "lucide-react";
import type { Note } from "@/components/notes/types";

interface NoteCardProps {
  note: Note;
  isShared: boolean;
  isPending: boolean;
  onShareToggle: (noteId: string, isShared: boolean) => void;
  multiSelectMode?: boolean;
  isSelected?: boolean;
  onSelectNote?: (noteId: string, selected: boolean) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  isShared, 
  isPending, 
  onShareToggle,
  multiSelectMode = false,
  isSelected = false,
  onSelectNote
}) => {
  return (
    <Card key={note.id} className={multiSelectMode && isSelected ? "border-primary" : ""}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {multiSelectMode && onSelectNote && (
              <Checkbox 
                id={`select-note-${note.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  onSelectNote(note.id, checked === true);
                }}
                className="mt-1"
              />
            )}
            <div className="flex-1">
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <CardDescription>
                {note.content.substring(0, 100)}...
              </CardDescription>
            </div>
          </div>
          {!multiSelectMode && (
            <Button
              variant={isShared ? "destructive" : "secondary"}
              size="sm"
              onClick={() => onShareToggle(note.id, isShared)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isShared ? (
                "Unshare"
              ) : (
                "Share"
              )}
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};
