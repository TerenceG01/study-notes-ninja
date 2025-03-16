
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2 sm:space-y-3 w-full max-w-full overflow-y-auto max-h-[250px] sm:max-h-[300px] pr-2">
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
          className={`w-full justify-start text-left h-auto ${isMobile ? 'py-2 px-3 text-xs' : 'py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base'} whitespace-normal`}
          onClick={() => onSelect(option.id, option.is_correct)}
          disabled={isAnswered}
        >
          <div className="flex items-start gap-2 w-full">
            <div className="flex-shrink-0 mt-1">
              {isAnswered && option.is_correct && (
                <Check className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
              )}
              {isAnswered && selectedOption === option.id && !option.is_correct && (
                <X className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
              )}
            </div>
            <span className="break-words line-clamp-3">{option.content}</span>
          </div>
        </Button>
      ))}
      {isAnswered && options.find(o => o.id === selectedOption)?.explanation && (
        <div className="mt-3 p-2 sm:p-4 bg-muted rounded-lg">
          <p className="text-xs break-words">{options.find(o => o.id === selectedOption)?.explanation}</p>
        </div>
      )}
    </div>
  );
};
