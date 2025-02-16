
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface GroupMember {
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
}

interface GroupMembersListProps {
  members: GroupMember[];
}

export const GroupMembersList = ({ members }: GroupMembersListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Members ({members?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members?.map((member) => (
            <div
              key={member.user_id}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {member.profiles?.username || member.profiles?.full_name || 'Unknown User'}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
