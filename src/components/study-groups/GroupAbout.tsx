
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface GroupAboutProps {
  description: string | null;
  createdAt: string;
}

export const GroupAbout = ({ description, createdAt }: GroupAboutProps) => {
  // Add null check for createdAt
  if (!createdAt) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {description || "No description provided."}
        </p>
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <CalendarDays className="h-4 w-4 mr-2" />
          Created {format(new Date(createdAt), 'PPP')}
        </div>
      </CardContent>
    </Card>
  );
};
