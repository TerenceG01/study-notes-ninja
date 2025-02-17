
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShareNote } from "./ShareNote";

interface GroupHeaderProps {
  name: string;
  subject: string;
  userRole?: string;
  groupId: string;
}

export const GroupHeader = ({ name, subject, userRole, groupId }: GroupHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/study-groups')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Study Groups
      </Button>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">{name}</h1>
          <p className="text-lg text-muted-foreground mt-2">{subject}</p>
        </div>
        {userRole && <ShareNote groupId={groupId} />}
      </div>
    </div>
  );
};
