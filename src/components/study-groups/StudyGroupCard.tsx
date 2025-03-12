
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
  member_count?: number;
}

interface StudyGroupCardProps {
  group: StudyGroup;
  onClick: () => void;
}

export const StudyGroupCard = ({ group, onClick }: StudyGroupCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card
      className="group cursor-pointer hover:bg-muted/50 transition-colors duration-200 h-full flex flex-col"
      onClick={onClick}
    >
      <CardHeader className={isMobile ? "p-3" : undefined}>
        <div className="flex flex-col gap-1">
          <CardTitle className={`flex items-start justify-between gap-2 ${isMobile ? "text-base" : ""}`}>
            <span className="font-semibold text-primary line-clamp-2">{group.name}</span>
          </CardTitle>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-normal shrink-0 self-start">
            {group.subject}
          </span>
        </div>
        <CardDescription className={`line-clamp-${isMobile ? "1" : "2"} text-xs sm:text-sm`}>
          {group.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? "p-3 pt-0" : ""} mt-auto`}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{group.member_count || 0}</span>
            <span className="hidden sm:inline">Members</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span className="hidden sm:inline">Notes</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground ml-auto">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(group.created_at), isMobile ? 'MM/dd' : 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
