
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { QuizCompletionCard } from "./QuizCompletionCard";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { QuizNavigation } from "./quiz/QuizNavigation";
import { DifficultyToggle } from "./quiz/DifficultyToggle";
import { useQuizState } from "@/hooks/useQuizState";

interface MultipleChoiceModeProps {
  flashcards: any[];
  deckId: string;
}

export const MultipleChoiceMode = ({ flashcards, deckId }: MultipleChoiceModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;

  const {
    correctAnswers,
    totalAttempted,
    selectedOption,
    isAnswered,
    hardMode,
    setHardMode,
    handleOptionSelect,
    resetQuiz,
    setIsAnswered,
    setSelectedOption,
  } = useQuizState(flashcards, currentCard?.id);

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
        <p className="text-lg font-medium">No flashcards available</p>
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
    <div className="max-w-[800px] w-full mx-auto">
      <DifficultyToggle
        hardMode={hardMode}
        onToggle={() => {
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
        currentIndex={currentIndex}
        totalCards={flashcards.length}
      />

      <Card className="w-full flex-shrink-0">
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
          onRestart={() => {
            resetQuiz();
            setCurrentIndex(0);
          }}
        />
      )}

      <QuizNavigation
        currentIndex={currentIndex}
        totalCards={flashcards.length}
        onNavigate={navigateCards}
      />

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Click an option to answer
      </div>
    </div>
  );
};
