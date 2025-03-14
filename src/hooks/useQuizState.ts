
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useQuizState = (flashcards: any[], currentCardId: string) => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ flashcardId, optionId, isCorrect }: { flashcardId: string, optionId: string, isCorrect: boolean }) => {
      const { error } = await supabase
        .from('multiple_choice_attempts')
        .insert({
          flashcard_id: flashcardId,
          selected_option_id: optionId,
          is_correct: isCorrect,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multiple-choice-attempts'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error submitting answer",
        description: error.message,
      });
    },
  });

  const handleOptionSelect = async (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);
    setTotalAttempted(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    submitAnswerMutation.mutate({
      flashcardId: currentCardId,
      optionId,
      isCorrect,
    });

    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect 
        ? "Great job! You got it right." 
        : "Don't worry, keep practicing to improve.",
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setTotalAttempted(0);
  };

  return {
    correctAnswers,
    totalAttempted,
    selectedOption,
    isAnswered,
    handleOptionSelect,
    resetQuiz,
    setIsAnswered,
    setSelectedOption,
  };
};
