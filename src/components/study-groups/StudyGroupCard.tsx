
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <Card
      className="group cursor-pointer hover:bg-muted/50 transition-colors duration-200"
      onClick={onClick}
    >
      <CardHeader className={isMobile ? "p-3" : undefined}>
        <CardTitle className={`flex items-start justify-between gap-2 ${isMobile ? "text-base" : ""}`}>
          <span className="line-clamp-1">{group.name}</span>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-normal shrink-0">
            {group.subject}
          </span>
        </CardTitle>
        <CardDescription className={`line-clamp-${isMobile ? "1" : "2"} text-xs sm:text-sm`}>
          {group.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "p-3 pt-0" : undefined}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Members</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Shared Notes</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground ml-auto">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{format(new Date(group.created_at), isMobile ? 'MM/dd' : 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
