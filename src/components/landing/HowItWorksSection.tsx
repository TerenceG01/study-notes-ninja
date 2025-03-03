
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
      {/* Creative element - layered waves */}
      <div className="absolute inset-0 -z-0 pointer-events-none overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(109, 40, 217, 0.05)" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(109, 40, 217, 0.03)" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,192C960,224,1056,256,1152,245.3C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
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
                  "flex items-start gap-5 text-left transition-all duration-700 delay-300 relative",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                )}
                style={{ transitionDelay: `${index * 150 + 300}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {/* Connecting line between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 left-6 w-0.5 h-12 bg-gradient-to-b from-primary/50 to-primary/10"></div>
                )}
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
