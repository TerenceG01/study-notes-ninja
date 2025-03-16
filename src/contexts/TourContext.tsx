
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

type TourStep = 
  | "welcome" 
  | "notes" 
  | "flashcards" 
  | "studyGroups" 
  | "completed";

interface TourContextType {
  currentStep: TourStep;
  isActive: boolean;
  startTour: () => void;
  nextStep: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextType>({
  currentStep: "welcome",
  isActive: false,
  startTour: () => {},
  nextStep: () => {},
  endTour: () => {},
});

export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<TourStep>("welcome");
  const [isActive, setIsActive] = useState(false);
  const { user, isFirstTimeUser, setIsFirstTimeUser } = useAuth();

  // Start tour automatically for first-time users
  useEffect(() => {
    if (user && isFirstTimeUser) {
      startTour();
    }
  }, [user, isFirstTimeUser]);

  const startTour = () => {
    setCurrentStep("welcome");
    setIsActive(true);
  };

  const nextStep = () => {
    switch (currentStep) {
      case "welcome":
        setCurrentStep("notes");
        break;
      case "notes":
        setCurrentStep("flashcards");
        break;
      case "flashcards":
        setCurrentStep("studyGroups");
        break;
      case "studyGroups":
        setCurrentStep("completed");
        break;
      case "completed":
        endTour();
        break;
    }
  };

  const endTour = async () => {
    setIsActive(false);
    
    // Mark user as having seen the intro
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ has_seen_intro: true })
          .eq('id', user.id);
          
        if (error) throw error;
        
        // Update local state
        setIsFirstTimeUser(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <TourContext.Provider 
      value={{ 
        currentStep, 
        isActive, 
        startTour, 
        nextStep, 
        endTour 
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
