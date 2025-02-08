
import { BookOpen, Brain, Users, Zap } from "lucide-react";

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

export const Features = () => {
  return (
    <div className="py-24 bg-secondary/50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need to Excel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
