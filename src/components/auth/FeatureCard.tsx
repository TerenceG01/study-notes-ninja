
import { memo } from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: string;
}

export const FeatureCard = memo(function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay = "0ms" 
}: FeatureCardProps) {
  return (
    <div 
      className="flex items-start gap-4 p-4 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: delay }}
    >
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
});
