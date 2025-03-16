
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourTooltipProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  position: "top" | "bottom" | "left" | "right" | "center";
  highlight?: string;
  onNext: () => void;
  onSkip: () => void;
  isLastStep?: boolean;
}

export const TourTooltip = ({
  title,
  content,
  icon,
  position = "bottom",
  highlight,
  onNext,
  onSkip,
  isLastStep = false
}: TourTooltipProps) => {
  // Position-based classes for the tooltip
  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  };
  
  // Arrow classes based on position
  const arrowClasses = {
    top: "bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-primary/10 border-l-transparent border-r-transparent",
    bottom: "top-[-6px] left-1/2 transform -translate-x-1/2 border-b-primary/10 border-l-transparent border-r-transparent",
    left: "right-[-6px] top-1/2 transform -translate-y-1/2 border-l-primary/10 border-t-transparent border-b-transparent",
    right: "left-[-6px] top-1/2 transform -translate-y-1/2 border-r-primary/10 border-t-transparent border-b-transparent",
    center: "hidden"
  };
  
  return (
    <div 
      className={cn(
        "absolute z-50 w-72 p-4 rounded-lg bg-card border shadow-lg",
        positionClasses[position],
        "animate-fade-in"
      )}
    >
      {/* Tooltip arrow */}
      <div 
        className={cn(
          "absolute w-0 h-0 border-solid border-8",
          arrowClasses[position]
        )}
      />
      
      {/* Close button */}
      <button 
        onClick={onSkip}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        aria-label="Skip tour"
      >
        <X size={16} />
      </button>
      
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{content}</p>
          {highlight && (
            <span className="inline-block mt-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {highlight}
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <Button 
          onClick={onNext} 
          size="sm" 
          className="gap-1"
        >
          {isLastStep ? "Finish" : "Next"} 
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
