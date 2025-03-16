
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Bookmark, BookOpen, BrainCircuit, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureMessage {
  id: number;
  icon: React.ReactNode;
  title: string;
  content: string;
  highlight?: string;
}

interface FeatureIntroductionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export const FeatureIntroduction = ({
  open,
  onOpenChange,
  onComplete
}: FeatureIntroductionProps) => {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const features: FeatureMessage[] = [
    {
      id: 1,
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      title: "Welcome to StudyMate!",
      content: "I'm here to guide you through the main features of our platform. Let's get started on your learning journey!",
      highlight: "Your smart study partner"
    },
    {
      id: 2,
      icon: <Bookmark className="h-5 w-5 text-blue-500" />,
      title: "Smart Notes",
      content: "Create and organize notes easily. Our AI can even help summarize them for better review later.",
      highlight: "AI-powered summaries"
    },
    {
      id: 3,
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
      title: "Flashcards",
      content: "Convert your notes into flashcards automatically or create your own to reinforce learning.",
      highlight: "Effortless memorization"
    },
    {
      id: 4,
      icon: <BrainCircuit className="h-5 w-5 text-purple-500" />,
      title: "Study Groups",
      content: "Collaborate with friends, share notes, and learn together in virtual study groups.",
      highlight: "Better together"
    }
  ];

  useEffect(() => {
    if (!open) return;
    
    // Show the first message immediately
    setVisibleMessages([0]);
    
    // Add subsequent messages with delays
    const timers = features.slice(1).map((_, index) => {
      return setTimeout(() => {
        setVisibleMessages(prev => [...prev, index + 1]);
        setActiveMessageIndex(index + 1);
      }, (index + 1) * 2000); // 2 second delay between messages
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [open, features.length]);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background rounded-lg">
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {features.map((feature, index) => {
              if (!visibleMessages.includes(index)) return null;
              return (
                <div 
                  key={feature.id}
                  className={cn(
                    "flex gap-3 transition-all duration-300",
                    index === activeMessageIndex ? "opacity-100" : "opacity-70"
                  )}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.content}</p>
                    {feature.highlight && (
                      <span className="inline-block mt-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {feature.highlight}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {visibleMessages.length === features.length && (
            <div className="pt-2 flex justify-end">
              <Button onClick={handleComplete} className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
