
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

interface EmptyGroupStateProps {
  onCreateClick: () => void;
}

export const EmptyGroupState = ({ onCreateClick }: EmptyGroupStateProps) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No study groups yet</h3>
        <p className="text-muted-foreground mb-4 text-center max-w-md">
          Create a group or join one using an invite code to start collaborating with other students
        </p>
        <Button
          onClick={onCreateClick}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Your First Group
        </Button>
      </CardContent>
    </Card>
  );
};
