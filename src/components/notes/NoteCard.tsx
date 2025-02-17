
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Note } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Delete, Edit } from "lucide-react";

interface NoteCardProps {
  note: Note;
  refetch: () => void;
}

export const NoteCard = ({ note, refetch }: NoteCardProps) => {
  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-3">{note.content}</p>
      </CardContent>
      <CardFooter className="pt-4 flex justify-end gap-2">
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Delete className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
