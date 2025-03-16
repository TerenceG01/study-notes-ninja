
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
  
  // Make sure we always have exactly 4 options, even if API returns fewer
  const normalizedOptions = [...options];
  while (normalizedOptions.length < 4) {
    normalizedOptions.push({
      id: `empty-${normalizedOptions.length}`,
      content: "",
      is_correct: false
    });
  }
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow flex flex-col space-y-2">
        {normalizedOptions.slice(0, 4).map((option) => (
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
            className={`w-full justify-start text-left h-[60px] ${isMobile ? 'py-2 px-3 text-xs' : 'py-2 px-3 text-sm'} whitespace-normal`}
            onClick={() => option.content ? onSelect(option.id, option.is_correct) : null}
            disabled={isAnswered || !option.content}
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
              <span className="break-words line-clamp-2">{option.content}</span>
            </div>
          </Button>
        ))}
      </div>
      
      {isAnswered && options.find(o => o.id === selectedOption)?.explanation && (
        <div className="mt-2 p-2 bg-muted rounded-lg h-[60px] overflow-auto">
          <p className="text-xs break-words">{options.find(o => o.id === selectedOption)?.explanation}</p>
        </div>
      )}
      
      {/* Placeholder for explanation when not answered or no explanation */}
      {(!isAnswered || !options.find(o => o.id === selectedOption)?.explanation) && (
        <div className="mt-2 h-[60px] invisible">
          <p className="text-xs">Placeholder for explanation</p>
        </div>
      )}
    </div>
  );
};
