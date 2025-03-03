import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  isVisible: boolean;
  handleGetStarted: () => void;
}

export const CTASection = ({ isVisible, handleGetStarted }: CTASectionProps) => {
  return (
    <section id="cta" className="py-16 bg-gradient-to-r from-primary/10 to-secondary/20 min-h-[40vh] flex items-center">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl text-center">
        <div 
          className={cn(
            "transition-all duration-1000 transform",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            Ready to Transform Your Study Experience?
          </h2>
          <p className={cn(
            "text-lg text-muted-foreground mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            Join our community of students and start taking smarter notes today.
          </p>
          <Button 
            size="lg" 
            className={cn(
              "rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-700 delay-400",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
