
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Option {
  id: string;
  content: string;
  is_correct: boolean;
  explanation?: string | null;
}

interface MultipleChoiceOptionsProps {
  options: Option[];
  isAnswered: boolean;
  selectedOption: string | null;
  onSelect: (optionId: string, isCorrect: boolean) => void;
}

export const MultipleChoiceOptions = ({ 
  options, 
  isAnswered, 
  selectedOption, 
  onSelect 
}: MultipleChoiceOptionsProps) => {
  return (
    <div className="space-y-3 w-full max-w-full overflow-hidden">
      {options.slice(0, 5).map((option) => (
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
          className="w-full justify-start text-left h-auto py-3 sm:py-4 px-4 sm:px-6 whitespace-normal break-words text-sm sm:text-base"
          onClick={() => onSelect(option.id, option.is_correct)}
          disabled={isAnswered}
        >
          <div className="flex items-start gap-2 w-full">
            <div className="flex-shrink-0 mt-1">
              {isAnswered && option.is_correct && (
                <Check className="h-4 w-4 text-white" />
              )}
              {isAnswered && selectedOption === option.id && !option.is_correct && (
                <X className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="break-words">{option.content}</span>
          </div>
        </Button>
      ))}
      {isAnswered && options.find(o => o.id === selectedOption)?.explanation && (
        <div className="mt-4 p-3 sm:p-4 bg-muted rounded-lg">
          <p className="text-xs sm:text-sm break-words">{options.find(o => o.id === selectedOption)?.explanation}</p>
        </div>
      )}
    </div>
  );
};
