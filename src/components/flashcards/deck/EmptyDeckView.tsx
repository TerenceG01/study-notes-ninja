
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const EmptyDeckView = () => {
  return (
    <Card className="w-full max-w-[800px] mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">No flashcards yet</p>
        <p className="text-muted-foreground mb-4">
          Add some flashcards to start studying
        </p>
      </CardContent>
    </Card>
  );
};
