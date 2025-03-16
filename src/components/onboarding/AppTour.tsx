
import { useEffect, useState } from "react";
import { useTour } from "@/contexts/TourContext";
import { TourTooltip } from "./TourTooltip";
import { Sparkles, Bookmark, BookOpen, BrainCircuit } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const AppTour = () => {
  const { currentStep, isActive, nextStep, endTour } = useTour();
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Handle navigation to the correct page for each step
  useEffect(() => {
    if (!isActive) return;
    setMounted(true);

    const navigateToFeature = async () => {
      switch (currentStep) {
        case "welcome":
          if (location.pathname !== "/") {
            navigate("/");
          }
          break;
        case "notes":
          if (location.pathname !== "/notes") {
            navigate("/notes");
          }
          break;
        case "flashcards":
          if (location.pathname !== "/flashcards") {
            navigate("/flashcards");
          }
          break;
        case "studyGroups":
          if (location.pathname !== "/study-groups") {
            navigate("/study-groups");
          }
          break;
        default:
          // Do nothing for completed state
          break;
      }
    };

    navigateToFeature();
  }, [currentStep, isActive, location.pathname, navigate]);

  // Wait for the component to be mounted
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isActive || !mounted) return null;

  // Render different tooltips based on current step
  const renderTooltip = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <TourTooltip
              title="Welcome to StudyMate!"
              content="We'll quickly show you around the app so you can get the most out of your studying experience."
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              position="center"
              highlight="Your smart study partner"
              onNext={nextStep}
              onSkip={endTour}
            />
          </div>
        );
      
      case "notes":
        return (
          <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-50">
            <TourTooltip
              title="Smart Notes"
              content="Create and organize notes easily. Our AI can help summarize them for better review."
              icon={<Bookmark className="h-5 w-5 text-blue-500" />}
              position="bottom"
              highlight="AI-powered summaries"
              onNext={nextStep}
              onSkip={endTour}
            />
          </div>
        );
      
      case "flashcards":
        return (
          <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-50">
            <TourTooltip
              title="Flashcards"
              content="Convert your notes into flashcards automatically or create your own to reinforce learning."
              icon={<BookOpen className="h-5 w-5 text-green-500" />}
              position="bottom"
              highlight="Effortless memorization"
              onNext={nextStep}
              onSkip={endTour}
            />
          </div>
        );
      
      case "studyGroups":
        return (
          <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-50">
            <TourTooltip
              title="Study Groups"
              content="Collaborate with friends, share notes, and learn together in virtual study groups."
              icon={<BrainCircuit className="h-5 w-5 text-purple-500" />}
              position="bottom"
              highlight="Better together"
              onNext={nextStep}
              onSkip={endTour}
              isLastStep={true}
            />
          </div>
        );
      
      case "completed":
        // This will trigger endTour which will clean up
        nextStep();
        return null;
      
      default:
        return null;
    }
  };

  return renderTooltip();
};
