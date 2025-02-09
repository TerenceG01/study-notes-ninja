
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

export const Hero = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-4 animate-fade-up">
      <div className="absolute top-4 right-4 flex gap-4">
        <Button variant="ghost" asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
        <Button asChild>
          <Link to="/auth?tab=sign-up">Get Started</Link>
        </Button>
      </div>
      
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
            onClick={() => setIsDialogOpen(true)}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg">
            See How It Works
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start Your Journey</DialogTitle>
            <DialogDescription>
              Join thousands of students who are already transforming their study experience. Create your free account to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Since you haven't connected Supabase yet, this is just a demo popup. Once Supabase is connected, we can add proper authentication forms here.
            </p>
            <Button onClick={() => setIsDialogOpen(false)}>
              Close for now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
