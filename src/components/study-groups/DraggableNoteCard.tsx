
import { useSortable } from "@dnd-kit/sortable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { GripVertical, Trash2 } from "lucide-react";
import { SharedNote } from "./types";

interface DraggableNoteCardProps {
  note: SharedNote;
  onNoteClick: (note: SharedNote) => void;
  onRemoveNote: (note: SharedNote) => void;
  isCurrentUserNote: boolean;
}

export const DraggableNoteCard = ({
  note,
  onNoteClick,
  onRemoveNote,
  isCurrentUserNote,
}: DraggableNoteCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: note.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;

  const sharedByName =
    note.shared_by_profile?.username ||
    note.shared_by_profile?.full_name ||
    "Unknown";
  const initials = sharedByName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-pointer transition-colors hover:shadow-lg border hover:border-accent relative group"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move p-2"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div onClick={() => onNoteClick(note)} className="w-full">
        <CardHeader className="space-y-0 pb-2 pl-10">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-1">{note.note.title}</CardTitle>
            {isCurrentUserNote && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveNote(note);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {note.note.content}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{sharedByName}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(note.shared_at), "MMM d")}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
