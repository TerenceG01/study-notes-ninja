
import { BookOpen, Brain, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturesSectionProps {
  isVisible: boolean;
}

// Feature data
const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Smart Organization",
    description: "Automatically organize your notes by subject, topic, and importance.",
  },
  {
    icon: <Brain className="h-8 w-8 text-primary" />,
    title: "AI-Powered Insights",
    description: "Get intelligent summaries and study recommendations based on your notes.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Collaborative Study",
    description: "Share notes and study together with classmates in real-time.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Quick Capture",
    description: "Capture your thoughts quickly with our intuitive editor and mobile app.",
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
        "p-6 rounded-xl border border-border hover:shadow-md hover:border-primary/20 transition-all duration-500 bg-card",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-4 text-primary">{feature.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  );
};

export const FeaturesSection = ({ isVisible }: FeaturesSectionProps) => {
  return (
    <section id="features" className="py-24">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div 
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-primary">Excel</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines powerful tools to help you study smarter, not harder.
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
