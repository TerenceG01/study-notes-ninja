
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  created_by: string;
  created_at: string;
  notification_enabled: boolean;
}

interface StudyGroupMember {
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
}

export const useStudyGroupData = (groupId: string | undefined) => {
  useEffect(() => {
    if (groupId) {
      console.log("StudyGroupDetails mounted with id:", groupId);
    }
  }, [groupId]);

  const { 
    data: studyGroup, 
    isLoading: isLoadingGroup, 
    error: groupError 
  } = useQuery({
    queryKey: ['study-group', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', groupId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Study group not found');
      console.log("Study group details fetched:", data);
      return data as StudyGroup;
    },
    enabled: !!groupId,
    refetchOnWindowFocus: false
  });

  const { 
    data: members, 
    isLoading: isLoadingMembers 
  } = useQuery({
    queryKey: ['study-group-members', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_group_members')
        .select(`
          user_id,
          role,
          joined_at,
          profiles (
            username,
            full_name
          )
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      console.log("Study group members fetched:", data?.length);
      return data as StudyGroupMember[];
    },
    enabled: !!groupId && !!studyGroup,
    refetchOnWindowFocus: false
  });

  return {
    studyGroup,
    members,
    isLoading: isLoadingGroup || isLoadingMembers,
    error: groupError
  };
};
