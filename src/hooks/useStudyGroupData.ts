
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (groupId) {
      console.log("StudyGroupDetails mounted with id:", groupId);
      
      // Set up subscription to study_groups table for real-time updates
      const studyGroupsChannel = supabase
        .channel('study_group_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'study_groups',
            filter: `id=eq.${groupId}`
          },
          (payload) => {
            console.log('Study group updated in real-time:', payload);
            // Force refetch of the study group data when a change is detected
            queryClient.invalidateQueries({ queryKey: ['study-group', groupId] });
          }
        )
        .subscribe();
        
      // Clean up subscription on unmount
      return () => {
        supabase.removeChannel(studyGroupsChannel);
      };
    }
  }, [groupId, queryClient]);

  const { 
    data: studyGroup, 
    isLoading: isLoadingGroup, 
    error: groupError,
    refetch: refetchGroup
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
    refetchOnWindowFocus: true,
    staleTime: 0, // Don't cache this data
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
    refetchOnWindowFocus: true
  });

  return {
    studyGroup,
    members,
    isLoading: isLoadingGroup || isLoadingMembers,
    error: groupError,
    refetchGroup
  };
};
