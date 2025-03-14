
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GroupData {
  groupName: string;
  memberEmails: string[];
}

export const useGroupNotifications = (groupId: string) => {
  // Fetch group members' emails for notifications
  return useQuery<GroupData>({
    queryKey: ['study-group-notification-data', groupId],
    queryFn: async () => {
      // Get group name
      const { data: groupInfo, error: groupError } = await supabase
        .from('study_groups')
        .select('name')
        .eq('id', groupId)
        .single();
      
      if (groupError) throw groupError;
      
      // Get group member emails
      const { data: members, error: membersError } = await supabase
        .from('study_group_members')
        .select(`
          user_id,
          profiles!inner (
            id
          )
        `)
        .eq('group_id', groupId);
        
      if (membersError) throw membersError;
      
      // Get user emails from auth - this requires authorization
      const { data: userEmails, error: userEmailsError } = await supabase
        .auth
        .admin
        .listUsers();
        
      // If we can't get emails directly, we'll return just the group name
      // The edge function will receive only the edited by user email
      if (userEmailsError) {
        console.log("Unable to fetch user emails:", userEmailsError);
        return { 
          groupName: groupInfo.name,
          memberEmails: []
        };
      }
      
      // Match user IDs to emails
      const memberEmails = members
        .map(member => {
          // Ensure member is defined and has user_id before accessing
          if (member && member.user_id) {
            // Fix: Properly type the userEmails data structure
            const userEmailObj = userEmails?.users?.find(user => user.id === member.user_id);
            return userEmailObj?.email;
          }
          return null;
        })
        .filter(Boolean) as string[];
      
      return {
        groupName: groupInfo.name,
        memberEmails
      };
    },
    enabled: !!groupId,
    // Only run this query when needed
    staleTime: Infinity,
  });
};
