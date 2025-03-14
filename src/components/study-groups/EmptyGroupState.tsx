
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen } from "lucide-react";

interface EmptyGroupStateProps {
  onCreateClick: () => void;
}

export const EmptyGroupState = ({ onCreateClick }: EmptyGroupStateProps) => {
  return (
    <Card className="bg-muted/30 border-dashed border-2 border-muted">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-primary/10 p-4 rounded-full mb-5">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2 text-primary">No study groups yet</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md text-sm">
          Create your first study group to start collaborating with other students on notes, 
          reminders, and study materials
        </p>
        <Button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-5 py-6 font-medium text-base hover:scale-105 transition-transform duration-200"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Create Your First Group
        </Button>
        <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>Or join an existing group with an invite code</span>
        </div>
      </CardContent>
    </Card>
  );
};
