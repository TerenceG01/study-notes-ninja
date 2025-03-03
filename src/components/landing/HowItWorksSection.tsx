
import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HowItWorksSectionProps {
  isVisible: boolean;
  handleGetStarted: () => void;
}

// How it works steps
const steps = [
  {
    title: "Take Notes Your Way",
    description: "Capture ideas with our flexible editor that adapts to your style.",
  },
  {
    title: "Get AI Enhancements",
    description: "Our AI tools help organize, summarize, and improve your notes.",
  },
  {
    title: "Study Smarter",
    description: "Generate flashcards, summaries, and study materials automatically.",
  },
];

export const HowItWorksSection = ({ isVisible, handleGetStarted }: HowItWorksSectionProps) => {
  return (
    <section id="howItWorks" className="py-24 bg-secondary/20 relative overflow-hidden">
      {/* Larger floating elements */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="animate-float-slow absolute top-20 left-1/3 w-56 h-56 rounded-full bg-primary/5"></div>
        <div className="animate-float-medium absolute bottom-24 right-20 w-72 h-72 rounded-full bg-secondary/10"></div>
        <div className="animate-float-fast absolute top-40 right-1/4 w-40 h-40 rounded-full bg-primary/5"></div>
      </div>
      
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl relative z-10">
        <div 
          className={cn(
            "flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
            <Lightbulb className="w-4 h-4 mr-2" />
            How It Works
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold">
            Supercharge Your Study Process
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Our platform uses AI to help you create better study materials, understand complex topics,
            and retain information more effectively.
          </p>
          
          <div className="w-full max-w-md space-y-6 mt-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-start gap-5 text-left transition-all duration-700 delay-300",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                )}
                style={{ transitionDelay: `${index * 150 + 300}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold shrink-0 animate-pulse-slow">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            className="mt-8 rounded-full"
            onClick={handleGetStarted}
          >
            Start Taking Notes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
