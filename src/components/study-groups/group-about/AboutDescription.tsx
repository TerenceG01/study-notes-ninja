
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface AboutDescriptionProps {
  description: string | null;
  createdAt: string;
}

export const AboutDescription = ({ description, createdAt }: AboutDescriptionProps) => {
  // Simpler and more reliable empty check
  const isEmpty = description === null || description === "" || description.trim() === "";
  
  return (
    <>
      <p className="text-muted-foreground whitespace-pre-line">
        {isEmpty ? "No description provided." : description}
      </p>
      <div className="flex items-center text-sm text-muted-foreground mt-4">
        <CalendarDays className="h-4 w-4 mr-2" />
        Created {format(new Date(createdAt), 'PPP')}
      </div>
    </>
  );
};
