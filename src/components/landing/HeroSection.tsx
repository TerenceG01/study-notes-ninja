
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  isVisible: boolean;
  handleGetStarted: () => void;
  handleSignIn: () => void;
}
export const HeroSection = ({
  isVisible,
  handleGetStarted,
  handleSignIn
}: HeroSectionProps) => {
  return <section id="hero" className="relative pt-20 lg:pt-28 overflow-hidden">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center">
          <div className={cn("space-y-8 max-w-2xl mx-auto transition-all duration-1000 transform", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Smart Note-Taking for Students
            </div>
            
            <div className="relative">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block mb-2">Transform Notes into</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500">
                  Lasting Knowledge
                </span>
              </h1>
              
              {/* Diagonal creative element */}
              <div className="absolute -z-10 inset-0 w-full h-full">
                <div className="absolute -inset-10 bg-gradient-to-tr from-primary/5 to-transparent transform -rotate-6"></div>
                <div className="absolute -inset-10 bg-gradient-to-bl from-secondary/10 to-transparent transform rotate-6"></div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              The intelligent note-taking platform designed for students. Organize, collaborate, 
              and excel with AI-powered study tools.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25" onClick={handleGetStarted}>
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-primary/20 hover:bg-primary/5" onClick={handleSignIn}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
