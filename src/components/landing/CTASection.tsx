
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  isVisible: boolean;
  handleGetStarted: () => void;
}

export const CTASection = ({ isVisible, handleGetStarted }: CTASectionProps) => {
  return (
    <section id="cta" className="py-20 bg-gradient-to-r from-primary/10 to-secondary/20 relative overflow-hidden">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl text-center relative z-10">
        <div 
          className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of students and start taking smarter notes today.
          </p>
          <Button 
            size="lg" 
            className="rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-0">
        <div className="animate-float-slow absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/5"></div>
        <div className="animate-float-medium absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-secondary/10"></div>
        <div className="animate-float-fast absolute top-3/4 left-3/4 w-24 h-24 rounded-full bg-primary/5"></div>
      </div>
    </section>
  );
};
