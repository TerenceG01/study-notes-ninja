
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface AboutDescriptionProps {
  description: string | null;
  createdAt: string;
}

export const AboutDescription = ({ description, createdAt }: AboutDescriptionProps) => {
  // Only show "No description provided" when description is null or empty string after trimming
  const displayText = description && description.trim() !== "" 
    ? description 
    : "No description provided.";
  
  return (
    <>
      <p className="text-muted-foreground whitespace-pre-line">
        {displayText}
      </p>
      <div className="flex items-center text-sm text-muted-foreground mt-4">
        <CalendarDays className="h-4 w-4 mr-2" />
        Created {format(new Date(createdAt), 'PPP')}
      </div>
    </>
  );
};
