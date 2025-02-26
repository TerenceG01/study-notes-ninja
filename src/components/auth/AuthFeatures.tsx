
import { memo } from "react";
import { BookOpen, PenLine, Brain, Users } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const AuthFeatures = memo(function AuthFeatures() {
  return (
    <div className="relative w-full p-8 z-10">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-primary animate-fade-in">
          Study Smarter with StudyNotes
        </h2>
        
        <div className="space-y-4">
          <FeatureCard
            icon={BookOpen}
            title="Smart Note Taking"
            description="Create and organize your study notes with ease"
          />
          <FeatureCard
            icon={PenLine}
            title="AI-Powered Summaries"
            description="Generate concise summaries of your notes automatically"
            delay="200ms"
          />
          <FeatureCard
            icon={Brain}
            title="Flashcard Generation"
            description="Convert your notes into interactive flashcards"
            delay="400ms"
          />
          <FeatureCard
            icon={Users}
            title="Study Groups"
            description="Collaborate with peers in interactive study groups"
            delay="600ms"
          />
        </div>
      </div>
    </div>
  );
});
