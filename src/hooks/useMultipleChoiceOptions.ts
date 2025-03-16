
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useMultipleChoiceOptions = (currentCardId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: options, isLoading: isOptionsLoading } = useQuery({
    queryKey: ['multiple-choice-options', currentCardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('multiple_choice_options')
        .select('*')
        .eq('flashcard_id', currentCardId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentCardId,
  });

  const generateOptionsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke('generate-multiple-choice', {
        body: { 
          flashcardId: currentCardId
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multiple-choice-options', currentCardId] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error generating options",
        description: error.message,
      });
    },
  });

  return {
    options,
    isOptionsLoading,
    generateOptionsMutation
  };
};
