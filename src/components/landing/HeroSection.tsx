import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
              
              {/* Animated floating shapes */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="animate-float-slow absolute -top-4 -left-8 w-16 h-16 rounded-full bg-primary/10"></div>
                <div className="animate-float-medium absolute top-1/4 right-8 w-20 h-20 rounded-full bg-secondary/20"></div>
                <div className="animate-float-fast absolute bottom-0 left-1/4 w-12 h-12 rounded-full bg-primary/5"></div>
                <div className="animate-spin-slow absolute top-1/3 right-1/4 w-8 h-8 rounded-md bg-secondary/10"></div>
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