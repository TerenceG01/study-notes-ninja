
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { QuizCompletionCard } from "./QuizCompletionCard";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";

interface MultipleChoiceModeProps {
  flashcards: any[];
  deckId: string;
}

export const MultipleChoiceMode = ({ flashcards, deckId }: MultipleChoiceModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;

  useEffect(() => {
    setHardMode(false);
  }, [currentIndex]);

  const { data: options, isLoading: isOptionsLoading } = useQuery({
    queryKey: ['multiple-choice-options', currentCard?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('multiple_choice_options')
        .select('*')
        .eq('flashcard_id', currentCard.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentCard?.id,
  });

  const generateOptionsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke('generate-multiple-choice', {
        body: { 
          flashcardId: currentCard.id,
          hardMode: hardMode 
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multiple-choice-options', currentCard.id] });
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
    setTotalAttempted(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

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

  const resetQuiz = () => {
    setCurrentIndex(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setCorrectAnswers(0);
    setTotalAttempted(0);
    setHardMode(false);
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
        <p className="text-muted-foreground">Loading multiple choice options...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
        <Button
          variant={hardMode ? "default" : "outline"}
          onClick={() => {
            const newMode = !hardMode;
            setHardMode(newMode);
            generateOptionsMutation.mutate();
            toast({
              title: newMode ? "Hard Mode Enabled" : "Standard Mode Enabled",
              description: newMode 
                ? "Questions will now be more challenging"
                : "Questions will now be standard difficulty",
            });
          }}
          className="gap-2"
        >
          <Zap className={`h-4 w-4 ${hardMode ? "text-yellow-300" : ""}`} />
          {hardMode ? "Switch to Standard Mode" : "Switch to Hard Mode"}
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">{currentCard.question}</h3>
          <MultipleChoiceOptions
            options={options}
            isAnswered={isAnswered}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
          />
        </CardContent>
      </Card>

      {isLastCard && isAnswered && (
        <QuizCompletionCard
          correctAnswers={correctAnswers}
          totalAttempted={totalAttempted}
          onRestart={resetQuiz}
        />
      )}

      <div className="flex justify-between items-center mt-6">
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

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Click an option to answer
      </div>
    </div>
  );
};
