
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface AboutDescriptionProps {
  description: string | null;
  createdAt: string;
}

export const AboutDescription = ({ description, createdAt }: AboutDescriptionProps) => {
  // Improved empty check that's more visible in debugging
  const isEmpty = description === null || description === "" || description.trim() === "";
  
  // Debug what we're rendering
  console.log("AboutDescription rendering with:", { 
    description, 
    isEmpty, 
    createdAt 
  });
  
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
