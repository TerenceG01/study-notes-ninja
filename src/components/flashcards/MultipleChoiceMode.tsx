
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft, ArrowRight, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

interface MultipleChoiceModeProps {
  flashcards: any[];
  deckId: string;
}

export const MultipleChoiceMode = ({ flashcards, deckId }: MultipleChoiceModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentCard = flashcards[currentIndex];

  // Fetch multiple choice options for the current flashcard
  const { data: options, isLoading: isOptionsLoading, error: optionsError } = useQuery({
    queryKey: ['multiple-choice-options', currentCard?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('multiple_choice_options')
        .select('*')
        .eq('flashcard_id', currentCard.id);

      if (error) throw error;
      
      // If no options exist, generate them
      if (!data || data.length === 0) {
        await generateOptionsMutation.mutateAsync();
        
        // Fetch the newly generated options
        const { data: newOptions, error: newError } = await supabase
          .from('multiple_choice_options')
          .select('*')
          .eq('flashcard_id', currentCard.id);
          
        if (newError) throw newError;
        return newOptions || [];
      }
      
      return data;
    },
    enabled: !!currentCard?.id,
  });

  const generateOptionsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke('generate-multiple-choice', {
        body: { flashcardId: currentCard.id },
      });
      if (error) throw error;
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error generating options",
        description: error.message,
      });
    },
  });

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

    submitAnswerMutation.mutate({
      flashcardId: currentCard.id,
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

  const navigateCards = (direction: 'prev' | 'next') => {
    setIsAnswered(false);
    setSelectedOption(null);
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentCard || !options) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium mb-4">No flashcards available</p>
      </div>
    );
  }

  if (isOptionsLoading || generateOptionsMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Generating multiple choice options...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">{currentCard.question}</h3>
          <div className="space-y-3">
            {options.map((option) => (
              <Button
                key={option.id}
                variant={isAnswered 
                  ? option.is_correct 
                    ? "default" 
                    : selectedOption === option.id 
                      ? "destructive" 
                      : "outline"
                  : "outline"
                }
                className="w-full justify-start text-left h-auto py-4 px-6"
                onClick={() => handleOptionSelect(option.id, option.is_correct)}
                disabled={isAnswered}
              >
                <div className="flex items-center gap-2">
                  {isAnswered && option.is_correct && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                  {isAnswered && selectedOption === option.id && !option.is_correct && (
                    <X className="h-4 w-4 text-white" />
                  )}
                  <span>{option.content}</span>
                </div>
              </Button>
            ))}
          </div>
          {isAnswered && options.find(o => o.id === selectedOption)?.explanation && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">{options.find(o => o.id === selectedOption)?.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigateCards('prev')}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Card
        </Button>

        <Button
          variant="outline"
          onClick={() => navigateCards('next')}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next Card
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
