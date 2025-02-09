
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/notes');
    } else {
      navigate('/auth?tab=sign-up');
    }
  };
  
  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-4 animate-fade-up">
      <div className="max-w-4xl mx-auto">
        <div className="inline-block animate-fade-down">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-primary mb-8 inline-block">
            Smart Note-Taking for Students
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Transform Your Study Notes into Knowledge
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The intelligent note-taking platform designed for students. Organize, collaborate, and excel in your studies with AI-powered tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-accent transition-all duration-300"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg">
            See How It Works
          </Button>
        </div>
      </div>
    </div>
  );
};
