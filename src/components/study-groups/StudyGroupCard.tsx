
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

interface StudyGroupCardProps {
  group: StudyGroup;
  onClick: () => void;
}

export const StudyGroupCard = ({ group, onClick }: StudyGroupCardProps) => {
  return (
    <Card
      className="group cursor-pointer hover:bg-muted/50 transition-colors duration-200"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <span className="line-clamp-1">{group.name}</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-normal">
            {group.subject}
          </span>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {group.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Members</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Shared Notes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(group.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
