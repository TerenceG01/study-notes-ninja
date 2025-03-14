
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Loader2, Share2 } from "lucide-react";
import type { Note } from "@/components/notes/types";

interface NoteCardProps {
  note: Note;
  isShared: boolean;
  isPending: boolean;
  onShareToggle: (noteId: string, isShared: boolean) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  isShared, 
  isPending, 
  onShareToggle 
}) => {
  return (
    <Card key={note.id}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{note.title}</CardTitle>
            <CardDescription>
              {note.content.substring(0, 100)}...
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>
    </Card>
  );
};
