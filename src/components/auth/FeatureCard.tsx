
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: string;
}

export function FeatureCard({ icon: Icon, title, description, delay = "0ms" }: FeatureCardProps) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg bg-white/80 dark:bg-black/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-[fadeSlideIn_0.5s_ease-out_${delay}_forwards]`}>
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
