
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar, Book } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

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
      className="group cursor-pointer hover:bg-muted/50 transition-all duration-300 h-full flex flex-col 
                hover:shadow-md hover:-translate-y-1 border-muted"
      onClick={onClick}
    >
      <CardHeader className={`pb-2 ${isMobile ? "p-4" : undefined}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className={`text-primary line-clamp-2 ${isMobile ? "text-base" : ""}`}>
              {group.name}
            </CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary px-2 py-0.5 w-fit hover:bg-primary/20">
            <BookOpen className="h-3 w-3 mr-1" />
            {group.subject}
          </Badge>
        </div>
        <CardDescription className={`line-clamp-${isMobile ? "2" : "3"} text-xs sm:text-sm mt-1`}>
          {group.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? "p-4 pt-0" : "pt-0"} mt-auto`}>
        <div className="flex justify-between items-center gap-2 text-xs border-t border-border/50 pt-3 mt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">{group.member_count ?? 0}</span>
            <span className="hidden sm:inline">member{(group.member_count !== 1) ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(group.created_at), isMobile ? 'MM/dd/yy' : 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
