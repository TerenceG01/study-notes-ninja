
import { Card, CardContent } from "@/components/ui/card";
import { PenLine } from "lucide-react";

export const EmptyNotesState = () => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <PenLine className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No notes yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Create your first note to get started with organizing your thoughts and ideas
        </p>
      </CardContent>
    </Card>
  );
};
