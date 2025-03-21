
import { format } from "date-fns";

interface AboutDescriptionProps {
  description: string | null;
  createdAt: string;
  canEdit?: boolean; // Add this prop with optional flag
}

export const AboutDescription = ({ description, createdAt, canEdit = false }: AboutDescriptionProps) => {
  const isEmpty = !description || description.trim() === '';
  
  console.log("AboutDescription rendering with:", { 
    description, 
    isEmpty, 
    createdAt,
    canEdit 
  });

  return (
    <div className="space-y-4">
      <div className="min-h-[80px]">
        {isEmpty ? (
          <p className="text-muted-foreground italic">
            No description available. {canEdit ? 'Click the edit button to add one.' : ''}
          </p>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{description}</p>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        Created on {format(new Date(createdAt), 'MMMM d, yyyy')}
      </div>
    </div>
  );
};
