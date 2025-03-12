
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShareNoteDialog } from "./share-note/ShareNoteDialog";

interface GroupHeaderProps {
  name: string;
  subject: string;
  userRole?: string;
  groupId: string;
}

export const GroupHeader = ({
  name,
  subject,
  userRole,
  groupId
}: GroupHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        className="mb-4 px-2 -ml-2" 
        onClick={() => navigate('/study-groups')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Study Groups
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary line-clamp-2">{name}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{subject}</p>
        </div>
        {userRole && (
          <div className="shrink-0">
            <ShareNoteDialog groupId={groupId} />
          </div>
        )}
      </div>
    </div>
  );
};
