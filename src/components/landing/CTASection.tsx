
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
      
      {/* Creative element - staggered dots pattern */}
      <div className="absolute inset-0 -z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex justify-around">
              {Array.from({ length: 12 }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className={`h-2 w-2 rounded-full ${(rowIndex + colIndex) % 2 === 0 ? 'bg-primary/10' : 'bg-secondary/15'}`}
                  style={{ 
                    transform: `translate(${(colIndex - 6) * 120}px, ${(rowIndex * 100) + 20}px)`,
                    opacity: 0.5 + (0.1 * ((rowIndex + colIndex) % 5))
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
