
import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface HowItWorksSectionProps {
  isVisible: boolean;
  handleGetStarted: () => void;
}

export const HowItWorksSection = ({ isVisible, handleGetStarted }: HowItWorksSectionProps) => {
  const { t } = useLanguage();
  
  // How it works steps
  const steps = [
    {
      title: t("takeNotesYourWay"),
      description: t("captureIdeas"),
    },
    {
      title: t("getAIEnhancements"),
      description: t("aiToolsHelp"),
    },
    {
      title: t("studySmarter"),
      description: t("generateFlashcards"),
    },
  ];

  return (
    <section id="howItWorks" className="py-16 bg-secondary/20 min-h-[80vh] flex items-center">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div 
          className={cn(
            "flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          )}
        >
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 transition-all duration-500",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            <Lightbulb className="w-4 h-4 mr-2" />
            {t("howItWorks")}
          </div>
          
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {t("superchargeStudy")}
          </h2>
          
          <p className={cn(
            "text-lg text-muted-foreground transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {t("platformUsesAI")}
          </p>
          
          <div className="w-full max-w-md space-y-10 mt-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-start gap-5 text-left transition-all duration-1000",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
                )}
                style={{ transitionDelay: `${index * 200 + 300}ms` }}
              >
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold shrink-0 transition-all duration-500",
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )} style={{ transitionDelay: `${index * 200 + 400}ms` }}>
                  {index + 1}
                </div>
                <div>
                  <h3 className={cn(
                    "font-semibold text-lg transition-all duration-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  )} style={{ transitionDelay: `${index * 200 + 500}ms` }}>
                    {step.title}
                  </h3>
                  <p className={cn(
                    "text-muted-foreground transition-all duration-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  )} style={{ transitionDelay: `${index * 200 + 600}ms` }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            className={cn(
              "mt-12 rounded-full transition-all duration-700 delay-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
            onClick={handleGetStarted}
          >
            {t("startTakingNotes")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
