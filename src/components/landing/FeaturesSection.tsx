
import { BookOpen, Brain, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeaturesSectionProps {
  isVisible: boolean;
}

export const FeaturesSection = ({ isVisible }: FeaturesSectionProps) => {
  const { t } = useLanguage();
  
  // Feature data with translation keys
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: t("smartOrganization"),
      description: t("organizeNotesDescription"),
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: t("aiPoweredInsights"),
      description: t("intelligentSummariesDescription"),
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t("collaborativeStudy"),
      description: t("shareNotesDescription"),
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: t("quickCapture"),
      description: t("captureThoughtsDescription"),
    },
  ];

  // Feature card component
  const FeatureCard = ({ 
    feature, 
    index, 
    isVisible 
  }: { 
    feature: typeof features[0], 
    index: number,
    isVisible: boolean
  }) => {
    return (
      <div 
        className={cn(
          "p-6 rounded-xl border border-border hover:shadow-md hover:border-primary/20 transition-all duration-700 bg-card",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        )}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className={cn(
          "mb-4 text-primary transition-all duration-500",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
        )} style={{ transitionDelay: `${(index * 150) + 200}ms` }}>
          {feature.icon}
        </div>
        <h3 className={cn(
          "text-xl font-semibold mb-2 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )} style={{ transitionDelay: `${(index * 150) + 300}ms` }}>
          {feature.title}
        </h3>
        <p className={cn(
          "text-muted-foreground transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )} style={{ transitionDelay: `${(index * 150) + 400}ms` }}>
          {feature.description}
        </p>
      </div>
    );
  };

  return (
    <section id="features" className="py-10 min-h-[60vh] flex items-center">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div 
          className={cn(
            "text-center mb-16 transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("everythingToExcel")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("platformDescription")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              index={index} 
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
